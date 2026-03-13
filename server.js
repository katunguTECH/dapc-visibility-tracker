// server.js
// Load environment variables
require("dotenv").config(); // Make sure you have a .env file with SERP_API_KEY

// Optional: fallback if SERP_API_KEY is not in .env
process.env.SERP_API_KEY = process.env.SERP_API_KEY || "1feeabd5f152d18a90c8ae60cc773703a6c7770efa77877359ee5f5c1f66eabd";

// Import Node.js http module and Next.js
const http = require("http");
const next = require("next");

// Detect environment
const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;

// Create Next.js app instance
const app = next({ dev });
const handle = app.getRequestHandler();

// Prepare Next.js and start server
app.prepare().then(() => {
  http
    .createServer((req, res) => {
      handle(req, res); // Pass all requests to Next.js
    })
    .listen(port, () => {
      console.log(`Next.js server running on http://localhost:${port}`);
      console.log(`SERP API Key Loaded: ${!!process.env.SERP_API_KEY}`);
    });
});
