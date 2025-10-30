const express = require("express");
const ENV_VARIABLES = require("./config/env");
const connectToDatabase = require("./config/dbConfig");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");
const userRouter = require("./routes/userRouter");
const postRouter = require("./routes/post.route");
const commentRouter = require("./routes/comment.route");
const notificationRouter = require("./routes/notification.route");
const arcjetMiddleware = require("./middlewares/arcjet");

const app = express();

// Fix: Only set once
process.setMaxListeners(20);

app.use(cors());
app.use(express.json());

app.use(clerkMiddleware());

// Define a simple route for testing
app.get("/", (req, res) => {
  res.send("API Health is Good! ✅ All Systems Operational. 🧠");
});

// Apply Arcjet middleware selectively - exclude sync endpoint
app.use((req, res, next) => {
  if (req.path === "/api/users/sync") {
    return next(); // Skip Arcjet for sync endpoint
  }
  return arcjetMiddleware(req, res, next);
});

//user routes
app.use("/api/users", userRouter);

//post routes
app.use("/api/posts", postRouter);

//comment routes
app.use("/api/comments", commentRouter);

//notification routes
app.use("/api/notifications", notificationRouter);

(async () => {
  try {
    await connectToDatabase();
    if (ENV_VARIABLES.NODE_ENV !== "production") {
      app.listen(ENV_VARIABLES.PORT, () => {
        console.log(
          `Server is running on port http://localhost:${ENV_VARIABLES.PORT}`
        );
      });
    }
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();

//export for vercel
module.exports = app;
