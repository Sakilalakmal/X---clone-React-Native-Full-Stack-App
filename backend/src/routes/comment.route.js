const express = require("express");
const {
  getCommentForPost,
  createCommentForPost,
  deleteComment,
} = require("../controllers/comment.controller");
const { isAuth } = require("../middlewares/iaAuth.middleware");

const commentRouter = express.Router();

//public route

commentRouter.get("/post/:postId", getCommentForPost);

//private route

commentRouter.post("/create/post/:postId", isAuth, createCommentForPost);

commentRouter.delete("/:commentId", isAuth, deleteComment);

module.exports = commentRouter;
