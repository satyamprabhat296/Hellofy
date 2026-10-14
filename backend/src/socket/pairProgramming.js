import { Server } from "socket.io";

export const initPairProgrammingSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://hellofy-jet.vercel.app",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🧑‍💻 User connected:", socket.id);

    socket.on("joinRoom", (roomId) => {
      if (!roomId) return;

      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("codeChange", ({ roomId, code }) => {
      if (!roomId) return;
      socket.to(roomId).emit("codeUpdate", code);
    });

    socket.on("languageChange", ({ roomId, language }) => {
      if (!roomId) return;
      socket.to(roomId).emit("languageUpdate", language);
    });

    socket.on("cursorChange", ({ roomId, cursor }) => {
      if (!roomId || !cursor) return;

      socket.to(roomId).emit("cursorUpdate", {
        socketId: socket.id,
        cursor,
      });
    });

    socket.on("disconnecting", () => {
      for (const roomId of socket.rooms) {
        if (roomId !== socket.id) {
          socket.to(roomId).emit("userDisconnected", socket.id);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });

  return io;
};
