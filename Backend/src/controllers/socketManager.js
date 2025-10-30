import { connections } from "mongoose";
import { Server, Socket } from "socket.io";

let messages = {};
let timeOnline = {};
// const [messages, setMessages] = useState([]);
// const messagesRef = useRef([]);

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.emit("all-messages", messages[socket.id] || []);//new part


    socket.on("join-call", (path) => {
      if (connections[path] === undefined) {
        connections[path] = [];
      }
      connections[path].push(socket.id);
      timeOnline[socket.id] = new Date();

      for (let a = 0; a < connections[path].length; a++) {
        io.to(connections[path][a]).emit(
          "user-joined",
          socket.id,
          connections[path]
        );
      }

      if (messages[path] !== undefined) {
        for (let a = 0; a < messages[path].length; a++) {
          io.to(socket.id).emit(
            "chat-message",
            messages[path][a]["data"],
            messages[path][a]["sender"],
            messages[path][a]["socket-is-sender"]
          );
        }
      }
    });

    socket.on("signal", (told, message) => {
      io.to(told).emit("signal", socket.id, message);
    });

    //message function


    // socket.on("chat-message", (data, sender) => {
    //   const [matchingRoom, found] = Object.entries(connections).reduce(
    //     ([room, isFound], [roomKey, roomValue]) => {
    //       const roomArray = Array.isArray(roomValue) ? roomValue : [roomValue];
    //       if (!isFound && roomArray.includes(socket.id)) {
    //         return [roomKey, true];
    //       }
    //       return [room, isFound];
    //     },
    //     ["", false]
    //   );

    //   if (found) {
    //     if (!messages[matchingRoom]) messages[matchingRoom] = [];

    //     messages[matchingRoom].push({
    //       sender,
    //       data,
    //       "socket-id-sender": socket.id,
    //     });

    //     connections[matchingRoom] = Array.isArray(connections[matchingRoom])
    //       ? connections[matchingRoom]
    //       : [connections[matchingRoom]];

       

    //     connections[matchingRoom].forEach((elem) => {
    //       if (elem !== socket.id) {
    //         io.to(elem).emit("chat-message", data, sender, socket.id);
    //       }
    //     });
    //   }
    // });


    //updated part
    socket.on("chat-message", (data, sender) => {
  // Find the room this socket is in
  const [matchingRoom, found] = Object.entries(connections).reduce(
    ([room, isFound], [roomKey, roomValue]) => {
      const roomArray = Array.isArray(roomValue) ? roomValue : [roomValue];
      if (!isFound && roomArray.includes(socket.id)) {
        return [roomKey, true];
      }
      return [room, isFound];
    },
    ["", false]
  );

  if (found) {
    // Store messages only for this user
    if (!messages[socket.id]) messages[socket.id] = [];

    messages[socket.id].push({
      sender,
      data,
      "socket-id-sender": socket.id,
    });

    // Send to other members except sender
    connections[matchingRoom] = Array.isArray(connections[matchingRoom])
      ? connections[matchingRoom]
      : [connections[matchingRoom]];

    connections[matchingRoom].forEach((elem) => {
      if (elem !== socket.id) {
        io.to(elem).emit("chat-message", data, sender, socket.id);
      }
    });
  }
});

  


    socket.on("disconnect", () => {
      delete messages[socket.id];//new part
       console.log("User disconnected:", socket.id);//new part
      const diffTime = Math.abs(timeOnline[socket.id] - new Date());

      for (const [room, members] of Object.entries(connections)) {
        if (Array.isArray(members) && members.includes(socket.id)) {
          // Notify others
          members.forEach((memberId) => {
            if (memberId !== socket.id)
              io.to(memberId).emit("user-left", socket.id);
          });

          // Remove this socket
          connections[room] = members.filter((id) => id !== socket.id);

          // Delete empty room
          if (connections[room].length === 0) delete connections[room];
        }
      }
    });
  });
};
