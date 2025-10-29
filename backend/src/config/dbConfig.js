const mongoose = require("mongoose");
const ENV_VARIABLES = require("./env");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(ENV_VARIABLES.MONGODB_URI);
    console.log("Connected to MongoDB database Successfully ✅");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error; // Re-throw so server can handle it
  }
};

module.exports = connectToDatabase;
