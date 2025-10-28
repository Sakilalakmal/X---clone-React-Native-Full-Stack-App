const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

//start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
