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

process.setMaxListeners(0);
process.setMaxListeners(20);

app.use(cors());
app.use(express.json());

app.use(clerkMiddleware());
app.use(arcjetMiddleware);

// Define a simple route for testing
app.get("/", (req, res) => {
  res.send("API Health is Good! ✅ All Systems Operational. 🧠");
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
    app.listen(ENV_VARIABLES.PORT, () => {
      console.log(
        `Server is running on port http://localhost:${ENV_VARIABLES.PORT}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
