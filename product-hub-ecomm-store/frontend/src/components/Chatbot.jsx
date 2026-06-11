import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";

// The Python chatbot server URL
const CHATBOT_URL = "http://localhost:5001/chat";

//  PRODUCT CARD — shown inside chat when user searches a product
function ProductCard({ product }) {
  const discountedPrice = product.discountPercentage
    ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  return (
    <a
      href={`/products/${product.id}`}
      className="block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 no-underline group"
    >
      {/* Product Image */}
      <div className="relative">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            e.target.src = "https://placehold.co/200x112?text=No+Image";
          }}
        />
        {/* Discount badge */}
        {product.discountPercentage > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}
      </div>

      <div className="p-2.5">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-400 mb-0.5">{product.brand}</p>
        )}

        {/* Title */}
        <h4 className="font-semibold text-gray-800 text-xs leading-tight mb-1 line-clamp-2">
          {product.title}
        </h4>

        {/* Description */}
        <p className="text-xs text-gray-500 mb-2 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-orange-500 font-bold text-sm">
              ${product.price}
            </span>
            {discountedPrice && (
              <span className="text-gray-400 text-xs line-through">
                ${discountedPrice}
              </span>
            )}
          </div>
          {/* Rating */}
          <span className="text-xs text-gray-500 flex items-center gap-0.5">
            ⭐ {product.rating}
          </span>
        </div>

        {/* Category pill */}
        <span className="inline-block bg-orange-50 text-orange-600 text-xs px-2 py-0.5 rounded-full mb-2 capitalize">
          {product.category}
        </span>

        {/* View button */}
        <div className="w-full text-center bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium py-1.5 rounded-lg transition-colors">
          View Product →
        </div>
      </div>
    </a>
  );
}

//  MESSAGE BUBBLE — a single chat message
function MessageBubble({ message }) {
  const isBot = message.role === "bot";

  // Product cards message
  if (message.type === "products") {
    return (
      <div className="mb-3">
        {/* Intro text from Gemini */}
        {message.text && (
          <div className="flex items-start gap-2 mb-2">
            <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-sm shrink-0">
              🤖
            </div>
            <div className="bg-gray-100 px-3 py-2 rounded-2xl rounded-tl-sm text-sm text-gray-800 max-w-[80%]">
              <FormattedText text={message.text} />
            </div>
          </div>
        )}
        {/* Product cards grid */}
        <div className="ml-9 grid grid-cols-1 gap-2">
          {message.products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {/* "See more" note */}
        {message.total > message.products.length && (
          <div className="ml-9 mt-1">
            <a
              href="/products"
              className="text-xs text-orange-500 hover:underline"
            >
              + {message.total - message.products.length} more results → Browse
              all
            </a>
          </div>
        )}
      </div>
    );
  }

  // Normal text message
  return (
    <div
      className={`flex items-start gap-2 mb-3 w-full ${
        isBot ? "justify-start" : "justify-end"
      }`}
    >
      {/* Avatar (Only rendered for Bot) */}
      {isBot && (
        <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5">
          🤖
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
          isBot
            ? "bg-gray-100 text-gray-800 rounded-tl-sm"
            : "bg-orange-500 text-white rounded-tr-sm text-right ml-auto"
        }`}
      >
        <FormattedText text={message.text} isUser={!isBot} />
      </div>
    </div>
  );
}

//  FORMATTED TEXT — handles **bold** markdown in messages
function FormattedText({ text, isUser }) {
  if (!text) return null;
  return (
    <>
      {text.split("\n").map((line, i) => (
        <p key={i} className={i > 0 ? "mt-1" : ""}>
          {line
            .split(/(\*\*[^*]+\*\*)/)
            .map((part, j) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={j}>{part.slice(2, -2)}</strong>
              ) : (
                part
              ),
            )}
        </p>
      ))}
    </>
  );
}

//  TYPING INDICATOR — animated dots while bot is thinking
function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 mb-3">
      <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-sm shrink-0">
        🤖
      </div>
      <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm">
        <div className="flex gap-1 items-center h-3">
          {[0, 150, 300].map((delay) => (
            <div
              key={delay}
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

//  MAIN CHATBOT COMPONENT
function Chatbot() {
  // Is the chat window open?
  const [isOpen, setIsOpen] = useState(false);
  // All messages in the chat
  const [messages, setMessages] = useState([
    {
      role: "bot",
      type: "text",
      text: "Hi! I'm the **ProductHub AI Assistant**.\n\nI can help you with:\nFinding products\nYour orders & status\nNavigating the website\nAny website questions\n\nWhat can I help you with?",
    },
  ]);
  // Text in the input box
  const [input, setInput] = useState("");
  // Show typing dots while waiting for bot reply
  const [isTyping, setIsTyping] = useState(false);

  // Bottom scroll anchor
  const bottomRef = useRef(null);

  // Get the logged-in user from Redux store
  const currentUser = useSelector((state) => state.auth.currentUser);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Send message to Python server
  async function sendMessage() {
    const text = input.trim();
    if (!text || isTyping) return;

    // Add user's message to chat
    const userMsg = { role: "user", type: "text", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Build history array (last 10 messages) to send to server
      const history = messages.slice(-10).map((m) => ({
        role: m.role,
        text: m.text || "",
      }));

      // Get the JWT token from axiosInstance headers
      // (axiosInstance stores it after login)
      const authToken =
        axiosInstance.defaults.headers.common["Authorization"] || "";

      // Call the Python chatbot server
      const response = await fetch(CHATBOT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken, // pass JWT so server can fetch user's orders
        },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await response.json();

      // Add bot's reply to chat
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          type: data.type, // "text" or "products"
          text: data.text,
          products: data.products || [],
          total: data.total || 0,
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          type: "text",
          text: "Could not connect to the chatbot server. Please make sure the Python server is running on port 5001.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  // Send on Enter key
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // Quick suggestion chips
  const suggestions = [
    "Show me laptops",
    "My orders",
    "How to login?",
    "What categories?",
  ];

  // RENDER
  return (
    <>
      {/* CHAT WINDOW */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-4 z-50 w-80 bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200"
          style={{ height: "500px" }}
        >
          {/* Header */}
          <div className="bg-linear-to-r from-orange-500 to-orange-400 px-4 py-3 rounded-t-2xl flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg">
                🤖
              </div>
              <div>
                <p className="font-bold text-white text-sm">
                  ProductHub AI Assistant
                </p>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                  <p className="text-orange-100 text-xs">
                    {currentUser
                      ? `Hi, ${currentUser.fullName?.split(" ")[0]}!`
                      : "Online · Ask me anything"}
                  </p>
                </div>
              </div>
            </div>
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-white cursor-pointer text-xl w-7 h-7 flex items-center justify-center rounded-2xl transition-colors"
            >
              <svg
                className="w-14 h-14"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-3 py-3">
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions */}
          <div className="px-3 py-2 border-t border-gray-100 flex gap-1.5 overflow-x-auto shrink-0 scrollbar-hide">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setInput(s);
                }}
                className="whitespace-nowrap text-xs bg-orange-50 text-orange-600 border border-orange-200 px-2.5 py-1 rounded-full hover:bg-orange-100 transition-colors shrink-0"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input box */}
          <div className="px-3 pb-3 pt-2 border-t border-gray-100 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about the site..."
              disabled={isTyping}
              className="flex-1 bg-gray-100 text-gray-800 text-sm px-3 py-2 rounded-full outline-none focus:ring-2 focus:ring-orange-300 placeholder-gray-400 disabled:opacity-60"
            />
            {/* Send button */}
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="w-9 h-9 bg-orange-500 text-white rounded-full cursor-pointer flex items-center justify-center hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* FLOATING BUTTON (bottom-right) */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-5 right-4 z-50 w-14 h-14 bg-gray-900 text-white cursor-pointer rounded-full shadow-xl hover:bg-black transition-all hover:scale-110 flex items-center justify-center"
        title="AI Assistant"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
        )}
      </button>

      {/* Green "online" dot on button */}
      {!isOpen && (
        <div className="fixed bottom-16 right-14 z-50 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white shadow" />
      )}
    </>
  );
}

export default Chatbot;
