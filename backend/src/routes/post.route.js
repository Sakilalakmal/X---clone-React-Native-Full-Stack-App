const express = require("express");
const {
  getAllPosts,
  getPostById,
  getpostByUsername,
  createPost,
  likedPost,
  deletePost,
} = require("../controllers/post.controller");
const { upload } = require("../middlewares/upload.middleware");
const { isAuth } = require("../middlewares/iaAuth.middleware");

const postRouter = express.Router();

//? publlic routes

postRouter.get("/", getAllPosts);

postRouter.get("/:postId", getPostById);

postRouter.get("/user/:username", getpostByUsername);

//? protected routes

postRouter.post("/create", isAuth, upload.single("image"), createPost);

postRouter.post("/like/:postId", isAuth, likedPost);

postRouter.delete("/delete/:postId", isAuth, deletePost);

module.exports = postRouter;
