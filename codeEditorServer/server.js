const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const ACTIONS = require("./Actions");
const cors = require("cors");
const axios = require("axios");
const server = http.createServer(app);
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { v4: uuid } = require("uuid");
require("dotenv").config();

const languageConfig = {
  python3: { versionIndex: "3" },
  java: { versionIndex: "3" },
  cpp: { versionIndex: "4" },
  nodejs: { versionIndex: "3" },
  c: { versionIndex: "4" },
  ruby: { versionIndex: "3" },
  go: { versionIndex: "3" },
  scala: { versionIndex: "3" },
  bash: { versionIndex: "3" },
  sql: { versionIndex: "3" },
  pascal: { versionIndex: "2" },
  csharp: { versionIndex: "3" },
  php: { versionIndex: "3" },
  swift: { versionIndex: "3" },
  rust: { versionIndex: "3" },
  r: { versionIndex: "3" },
};

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};
const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
};

io.on("connection", (socket) => {

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {

        userSocketMap[socket.id] = username;

        socket.join(roomId);

        const clients = getAllConnectedClients(roomId);

        clients.forEach(({ socketId }) => {

            io.to(socketId).emit(ACTIONS.JOINED, {

                clients,

                username,

                socketId: socket.id,

            });

        });

    });

    // REALTIME CODE SYNC

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {

        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {

            code,

        });

    });

    // SYNC COMPLETE CODE WHEN NEW USER JOINS

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {

        io.to(socketId).emit(ACTIONS.CODE_CHANGE, {

            code,

        });

    });

    socket.on("disconnecting", () => {

        const rooms = [...socket.rooms];

        rooms.forEach((roomId) => {

            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {

                socketId: socket.id,

                username: userSocketMap[socket.id],

            });

        });

        delete userSocketMap[socket.id];

        socket.leave();

    });

});
app.post("/compile", async (req, res) => {

    const { code, input } = req.body;

    const jobId = uuid();

    const fileName = `${jobId}.cpp`;

    const tempDir = path.join(__dirname, "temp");

    const filePath = path.join(tempDir, fileName);

    const cleanCode = code.replace(/\u200B/g, "");

fs.writeFileSync(filePath, cleanCode);

const dockerCommand = `docker run --rm -i -v "${tempDir}:/app" gcc:latest sh -c "g++ /app/${fileName} -o /app/${jobId} && printf '${input}' | /app/${jobId}"`;    console.log(dockerCommand);

    exec(dockerCommand, (error, stdout, stderr) => {

        console.log("STDOUT:", stdout);
        console.log("STDERR:", stderr);

        try {

            fs.unlinkSync(filePath);

        }

        catch (err) {

            console.log(err);

        }

        if (error) {

            console.log("EXEC ERROR:", error);

            return res.json({

                output: stderr || error.message,

            });

        }

        res.json({

            output: stdout || "No Output",

        });

    });

});
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server is runnint on port ${PORT}`));
