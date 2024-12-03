const express = require("express");
const cors = require("cors");
const app = express();

let connections = [];

app.use(cors());

app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  connections.push(res);

  res.write(
    `data: ${JSON.stringify({
      time: new Date().toISOString(),
      connections: connections.length,
    })}\n\n`
  );

  res.on("close", () => {
    connections = connections.filter((conn) => conn !== res);
  });

  setInterval(() => {
    const data = JSON.stringify({
      time: new Date().toISOString(),
      connections: connections.length,
    });

    connections.forEach((conn) => conn.write(`data: ${data}\n\n`));
  }, 1000);
});

app.listen(3000, () => {
  console.log("SSE server started on http://localhost:3000");
});
