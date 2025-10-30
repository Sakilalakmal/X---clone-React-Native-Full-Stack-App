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
      // Extract format from file mimetype or default to 'png'
      const format = file.mimetype.split('/')[1];
      return ['jpeg', 'jpg', 'png', 'gif', 'webp'].includes(format) ? format : 'png';
    },
    public_id: (req, file) => {
      const timestamp = Date.now();
      const originalname = file.originalname ? file.originalname.split('.')[0] : 'image';
      return `${originalname}_${timestamp}`;
    },
    transformation: [{ width: 800, height: 600, crop: "limit", quality: "auto" }],
  },
});

module.exports = { cloudinary, storage };
