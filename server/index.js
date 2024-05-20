  import express from 'express';
  import cors from 'cors';
  import dotenv from "dotenv"
  import mongoose from 'mongoose';
  import authRouter from "./routes/authRouter.js";
  import postRouter from "./routes/postRouter.js";
  import commentRouter from "./routes/commentRouter.js";
  import postComments from "./routes/postComments.js";
  import tagRouter from "./routes/tagRouter.js";
  import uploadsRouter from "./routes/uploadsRouter.js";

  const app = express();
  dotenv.config();

  app.use(express.json());
  app.use(cors());
  app.use('/uploads', express.static('uploads'));
  app.use('/uploads/avatars', express.static('uploads/avatars'));

  //constants
  const PORT = process.env.PORT || 3003;
  const DB_USER = process.env.DB_USER;
  const DB_PASSWORD = process.env.DB_PASSWORD;
  const DB_NAME = process.env.DB_NAME;

  //routes
  app.use("/auth", authRouter);
  app.use("/posts", postRouter);
  app.use("/posts/comments", postComments);
  app.use("/comments", commentRouter);
  app.use("/tags", tagRouter);
  app.use("/upload", uploadsRouter);

  async function start() {
    try {
      await mongoose.connect(
          `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.1k3bths.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`,
      );
      app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
      console.log(e);
    }
  }
  start();

