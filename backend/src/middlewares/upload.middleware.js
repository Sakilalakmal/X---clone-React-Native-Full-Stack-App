const multer = require("multer");
const { storage } = require("../config/cloudinary");

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, //limit upto 5 mb
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image!"), false);
    }
  },
});

module.exports = { upload };
