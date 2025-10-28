const express = require("express");
const ENV_VARIABLES = require("./config/env");
const connectToDatabase = require("./config/dbConfig");

const app = express();

app.use(express.json());

// Define a simple route for testing
app.get("/", (req, res) => {
  res.send("API Health is Good! ✅ All Systems Operational. 🧠");
});

//connect to Data Base
connectToDatabase();

//start the server
app.listen(ENV_VARIABLES.PORT, () => {
  console.log(
    `Server is running on port http://localhost:${ENV_VARIABLES.PORT}`
  );
});
