const express = require("express");
const ENV_VARIABLES = require("./config/env");
const connectToDatabase = require("./config/dbConfig");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");
const userRouter = require("./routes/userRouter");
const postRouter = require("./routes/post.route");

const app = express();

app.use(cors());
app.use(express.json());

app.use(clerkMiddleware());

// Define a simple route for testing
app.get("/", (req, res) => {
  res.send("API Health is Good! ✅ All Systems Operational. 🧠");
});

//user routes
app.use("/api/users", userRouter);

//post routes
app.use("/api/posts", postRouter);

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
