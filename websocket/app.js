const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 3001 });

let clients = [];

server.on("connection", (ws) => {
  clients.push(ws);

  ws.on("close", () => {
    clients = clients.filter((client) => client !== ws);
  });

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
  });
});

setInterval(() => {
  const data = JSON.stringify({
    time: new Date().toISOString(),
    connections: clients.length,
  });

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}, 1000);

console.log("WebSocket server running on ws://localhost:3001");
