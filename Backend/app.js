import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";

import cors from "cors";
import { connectToSocket } from "./src/controllers/socketManager.js";
// import { start } from "node:repl";
import userRoutes from "./src/routers/user.router.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000);
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));
app.use("/api/v1/users", userRoutes);

app.get("/", (req, res) => {
  return res.json({ message: "hello Sarfarj" });
});

const start = async () => {
  try {
    const connectDB = await mongoose.connect(
      "mongodb+srv://sarfaraj786:AllAh%40786@cluster0.dkg9enu.mongodb.net/"
    );

    console.log(`✅ MONGO Connected DB Host: ${connectDB.connection.host}`);

    server.listen(app.get("port"), () => {
      console.log(`🚀 Listening on port ${app.get("port")}`);
    });
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

start();
