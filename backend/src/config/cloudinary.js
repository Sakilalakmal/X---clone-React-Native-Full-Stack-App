const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const ENV_VARIABLES = require("./env");

//configure cloudinary
cloudinary.config({
  cloud_name: ENV_VARIABLES.CLOUDINARY_CLOUD_NAME,
  api_key: ENV_VARIABLES.CLOUDINARY_API_KEY,
  api_secret: ENV_VARIABLES.CLOUDINARY_API_SECRET,
});

//configure multer storage cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "X_Clone",
    format: async (req, file) => {
      "png";
    },
    public_id: (req, file) => file.filename + "_" + Date.now(),
    transformation: [{ width: 500, height: 500, crop: "fill" }],
  },
});

module.exports = { cloudinary, storage };
