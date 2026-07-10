import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { app } from "./socket/socket.js";

app.use(cors({
    origin:["http://localhost:5173"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With' // Add this
      ],
      exposedHeaders: ['Authorization'], // Optional but recommended
      maxAge: 86400, // Cache preflight for 24h
    credentials: true,
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// import router

import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import propertyRouter from "./routes/property.route.js"
import messageRouter from "./routes/message.route.js";
import storyRouter from "./routes/story.route.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/property", propertyRouter);
app.use("/api/v1/stories", storyRouter);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(statusCode).json({
    success: false,
    message: message,
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

export { app };
