require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");

connectDB();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Auth server is running at http://localhost:${PORT}`);
  console.log(`   - Signup: POST http://localhost:${PORT}/api/signup`);
  console.log(`   - Login:  POST http://localhost:${PORT}/api/login`);
  console.log(`   - Orders: GET/POST http://localhost:${PORT}/api/orders`);
  console.log(`   - Orders: PATCH/DELETE http://localhost:${PORT}/api/orders/:orderId`);
});
