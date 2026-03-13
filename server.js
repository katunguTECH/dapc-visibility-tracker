// Load environment variables from .env
require("dotenv").config()

const http = require("http")
const next = require("next")

// Detect environment
const dev = process.env.NODE_ENV !== "production"

// Port for Node server
const port = process.env.PORT || 3000

// Create Next.js app
const app = next({ dev })
const handle = app.getRequestHandler()

// Prepare Next.js app
app.prepare().then(() => {

  const server = http.createServer((req, res) => {
    handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err

    console.log(`> Server running on http://localhost:${port}`)
    console.log("SERP_API_KEY loaded:", process.env.SERP_API_KEY ? "YES" : "NO")
  })

}).catch((err) => {
  console.error("Server failed to start:", err)
})
