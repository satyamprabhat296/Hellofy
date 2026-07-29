import { Server } from "socket.io";

export const initPairProgrammingSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://hellofy-jet.vercel.app"
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🧑‍💻 User connected:", socket.id);

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("codeChange", ({ roomId, code }) => {
      socket.to(roomId).emit("codeUpdate", code);
    });

    socket.on("languageChange", ({ roomId, language }) => {
      socket.to(roomId).emit("languageUpdate", language);
    });

    socket.on("cursorChange", ({ roomId, cursor }) => {
      socket.to(roomId).emit("cursorUpdate", {
        socketId: socket.id,
        cursor,
      });
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
      io.emit("userDisconnected", socket.id);
    });
  });
};