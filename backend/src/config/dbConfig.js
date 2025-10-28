const mongoose = require("mongoose");
const ENV_VARIABLES = require("./env");

const connectToDatabase = async () => {
await  mongoose
    .connect(ENV_VARIABLES.MONGODB_URI)
    .then(() => {
      console.log("Connected to MongoDB database Successfully ✅");
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = connectToDatabase;
