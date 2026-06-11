from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from pymongo import MongoClient
from bson import ObjectId
import requests
import json
import re
import jwt as pyjwt
import traceback
from dotenv import load_dotenv
import os

load_dotenv()

# ── CONFIG ─────────────────────────────────────────────
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
MONGO_URI      = os.getenv("MONGO_URI", "")
JWT_SECRET     = os.getenv("JWT_SECRET", "")
PRODUCTS_API   = os.getenv("PRODUCTS_API", "")
GEMINI_MODEL   = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

# ── FLASK ─────────────────────────────────────────────
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# ── GEMINI CLIENT ─────────────────────────────────────
gemini_client = genai.Client(api_key=GEMINI_API_KEY)


# ── MONGO ─────────────────────────────────────────────
try:
    mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    db         = mongo_client["user"]
    orders_col = db["orders"]
    users_col  = db["signups"]
    mongo_client.server_info()
    print("MongoDB connected")
except Exception as e:
    print(f"MongoDB connection failed: {e}")


# ── JWT USER ──────────────────────────────────────────
def get_user_from_token(auth_header):
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ")[1]
    try:
        return pyjwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except Exception as e:
        print(f"[Token error] {e}")
        return None


# ── ORDERS ────────────────────────────────────────────
def get_user_orders(user_id):
    try:
        raw = list(
            orders_col.find(
                {"userId": ObjectId(user_id), "hiddenForUser": False}
            ).sort("timestamp", -1)
        )

        result = []
        for o in raw:
            ts = o.get("timestamp")
            result.append({
                "orderId": str(o["_id"]),
                "date": ts.strftime("%d %b %Y") if ts else "N/A",
                "status": o.get("orderStatus", "pending"),
                "paymentStatus": o.get("paymentStatus", "pending"),
                "paymentMethod": o.get("paymentMethod", "cod"),
                "totalAmount": o.get("totalAmount", 0),
                "totalItems": o.get("totalItems", 0),
                "products": [
                    {
                        "name": p.get("name", "?"),
                        "qty": p.get("quantity", 1),
                        "price": p.get("price", 0),
                    }
                    for p in o.get("products", [])
                ],
            })
        return result
    except Exception as e:
        print(f"[DB error] {e}")
        traceback.print_exc()
        return []


# ── PRODUCTS API ──────────────────────────────────────
def search_products(query, limit=3):
    try:
        r = requests.get(
            f"{PRODUCTS_API}/products/search?q={query}&limit={limit}",
            timeout=5
        )
        data = r.json()
        return data.get("products", []), data.get("total", 0)
    except Exception as e:
        print(f"[Products API error] {e}")
        return [], 0


# ── GEMINI CALL ───────────────────────────────────────
def call_gemini(prompt):
    response = gemini_client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
    )
    return (response.text or "").strip()


# ── INTENT CLASSIFIER ─────────────────────────────────
def classify_intent(user_message):
    prompt = f"""
You are a classifier for an ecommerce website.

User message: "{user_message}"

Return ONLY JSON:
- product_search (include query)
- my_orders
- general
- off_topic

Examples:
{{"intent":"product_search","query":"laptop"}}
{{"intent":"my_orders"}}
{{"intent":"general"}}
{{"intent":"off_topic"}}
"""

    try:
        raw = call_gemini(prompt)
        raw = re.sub(r"```json|```", "", raw).strip()
        return json.loads(raw)
    except Exception as e:
        print(f"[Intent error] {e}")
        return {"intent": "general"}


# ── GEMINI CHAT ───────────────────────────────────────
def ask_gemini(user_message, extra_context, history, user_info=None):

    history_text = ""
    for m in history[-6:]:
        role = "User" if m.get("role") == "user" else "Assistant"
        history_text += f"{role}: {m.get('text','')}\n"

    who = (
        f"Logged-in user: {user_info.get('name')} | {user_info.get('email')}"
        if user_info else "User not logged in"
    )

    prompt = f"""
You are ProductHub AI assistant.

{who}

Extra context:
{extra_context or "None"}

Chat history:
{history_text or "None"}

Rules:
- Only answer ProductHub-related questions
- Be short and friendly
- If off-topic, refuse politely

User:
{user_message}
"""

    try:
        return call_gemini(prompt)
    except Exception as e:
        print(f"[Gemini error] {e}")
        traceback.print_exc()
        return "Sorry, I had an issue. Try again."


# ── CHAT ROUTE ────────────────────────────────────────
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(force=True)
        message = data.get("message", "").strip()
        history = data.get("history", [])
        auth = request.headers.get("Authorization", "")

        if not message:
            return jsonify({"type": "text", "text": "Send a message!"})

        print("\n" + "=" * 40)
        print("[User]:", message)

        token = get_user_from_token(auth)
        user_info = None

        if token:
            user_info = {
                "id": token.get("id"),
                "name": token.get("name"),
                "email": token.get("email"),
            }
            print("[User]:", user_info["name"])
        else:
            print("[Not logged in]")

        intent_data = classify_intent(message)
        intent = intent_data.get("intent", "general")

        print("[Intent]:", intent)

        # ── PRODUCT SEARCH ──
        if intent == "product_search":
            query = intent_data.get("query", message)

            products, total = search_products(query)

            if not products:
                reply = ask_gemini(message, "No products found.", history, user_info)
                return jsonify({"type": "text", "text": reply})

            summary = "\n".join(
                f"- {p['title']} | ${p['price']} | ⭐{p['rating']}"
                for p in products
            )

            intro = ask_gemini(
                message,
                f"Products:\n{summary}",
                history,
                user_info,
            )

            return jsonify({
                "type": "products",
                "text": intro,
                "products": products,
                "total": total,
                "query": query,
            })

        # ── ORDERS ──
        elif intent == "my_orders":
            if not user_info:
                return jsonify({
                    "type": "text",
                    "text": "Please login first to view orders."
                })

            orders = get_user_orders(user_info["id"])

            if not orders:
                context = "No orders found."
            else:
                context = json.dumps(orders, indent=2)

            reply = ask_gemini(message, context, history, user_info)
            return jsonify({"type": "text", "text": reply})

        # ── GENERAL ──
        elif intent == "general":
            reply = ask_gemini(message, None, history, user_info)
            return jsonify({"type": "text", "text": reply})

        # ── OFF TOPIC ──
        else:
            return jsonify({
                "type": "text",
                "text": "I only help with ProductHub shopping & orders 😊"
            })

    except Exception as e:
        print("[FATAL]", e)
        traceback.print_exc()
        return jsonify({"type": "error", "text": str(e)})


# ── HEALTH ────────────────────────────────────────────
@app.route("/health")
def health():
    return jsonify({"status": "running"})


# ── START ─────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 50)
    print("ProductHub AI Chatbot")
    print(f"Model: {GEMINI_MODEL}")
    print("=" * 50)

    app.run(port=5001, debug=True)
