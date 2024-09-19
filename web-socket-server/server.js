const WebSocket = require("ws");

// Set up WebSocket server
const port = process.env.PORT | 8080;
const wss = new WebSocket.Server({ port: port });

const rooms = {}; // { roomId: [player1, player2] }

wss.on("connection", (ws) => {
  console.log("New client connected");

  // When a client sends a message
  ws.on("message", (message) => {
    const data = JSON.parse(message);
    const { type, roomId, payload } = data;

    switch (type) {
      case "joinRoom":
        if (!rooms[roomId]) {
          rooms[roomId] = {
            players: {
              white: null,
              black: null,
            },
            currentTurn: "White",
          };
        }

        const room = rooms[roomId];
        if (room.players.white && room.players.black) {
          ws.send(
            JSON.stringify({ payload: "Room is full", type: "roomFullError" })
          );
          return;
        }

        // Assign player color (white if it's available, otherwise black)
        const playerColor = room.players.white ? "black" : "white";
        room.players[playerColor] = ws;

        rooms[roomId] = room;

        ws.send(JSON.stringify({ type: "welcome", payload: playerColor }));

        // If both players have joined, start the game
        if (room.players.white && room.players.black) {
          Object.values(room.players).forEach((playerWs) => {
            playerWs.send(
              JSON.stringify({
                type: "gameStart",
                payload: room.currentTurn,
              })
            );
          });
        }

        break;

      case "offer":
      case "answer":
      case "candidate":
        broadcastToRoom(roomId, ws, { type, payload });
        break;

      case "move":
        // Broadcast move to all clients in the room
        broadcastToRoom(roomId, ws, { type, payload });
        break;
    }
  });

  // Handle client disconnect
  ws.on("close", () => {
    // Find which room and player this WebSocket belongs to
    for (let roomId in rooms) {
      const room = rooms[roomId];

      if (room.players.white === ws) {
        room.players.white = null;
      } else if (room.players.black === ws) {
        room.players.black = null;
      }

      // If both players are gone, remove the room
      if (!room.players.white && !room.players.black) {
        delete rooms[roomId];
      } else {
        // Notify the remaining player
        const remainingPlayerWs = room.players.white || room.players.black;
        if (remainingPlayerWs) {
          remainingPlayerWs.send(
            JSON.stringify({
              payload: "Your opponent disconnected",
              type: "opponentDisconnected",
            })
          );
        }
      }
    }
  });
});

// Function to broadcast messages to other players in the room
function broadcastToRoom(roomId, sender, message) {
  const room = rooms[roomId];

  const players = room.players;

  const whiteClient = players.white;
  const blackClient = players.black;

  if (whiteClient !== sender) {
    whiteClient.send(JSON.stringify(message));
  }
  if (blackClient !== sender) {
    blackClient.send(JSON.stringify(message));
  }
}

console.log("WebSocket server started on ws://localhost:8080");
