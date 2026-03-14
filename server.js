// server.js
const express = require("express");
const bodyParser = require("body-parser");
const visibilityRouter = require("./src/app/api/visibility/route");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0"; // listen on all network interfaces

app.use(bodyParser.json());

// Use your API route
app.use("/api/visibility", visibilityRouter);

// Optional: simple home route
app.get("/", (req, res) => {
  res.send("DAPC Visibility Tracker API is running!");
});

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Ready on http://${HOST}:${PORT}`);
});
