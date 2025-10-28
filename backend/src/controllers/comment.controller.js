const AsyncHandler = require("express-async-handler");
const { getAuth } = require("@clerk/express");
const Comment = require("../models/comment.model");
const User = require("../models/user.model");
const Post = require("../models/post.model");
const Notification = require("../models/notification.model");

const commentController = {
  getCommentForPost: AsyncHandler(async (req, res) => {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate("user", "username firstName lastName profileImage");

    res.status(200).json({ comments });
  }),

  createCommentForPost: AsyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { userId } = getAuth(req);
    const { content } = req.body;

    if (!content || content.trim() === "") {
      res.status(400);
      throw new Error("Add comment to save");
    }

    const user = await User.findOne({ clerkId: userId });

    const post = await Post.findById(postId);

    if (!post || !post)
      return res.status(404).json({ message: "Post not found" });

    const comment = await Comment.create({
      user: user._id,
      post: postId,
      content,
    });

    //link to post
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment._id },
    });

    //create a notification  only if the commenter is not the post owner
    if (post.user.toString() !== user._id.toString()) {
      //send notification to post owner
      await Notification.create({
        from: user._id,
        to: post.user,
        type: "comment",
        post: post._id,
        comment: comment._id,
      });
    }

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  }),

  deleteComment: AsyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { userId } = getAuth(req);

    const user = await User.findOne({ clerkId: userId });

    const comment = await Comment.findById(commentId);

    if (!user || !comment) {
      return res.status(404).json({ message: "Comment or User not found" });
    }

    if (comment.user.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can't delete others comments" });
    }

    //delete comment from post
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: commentId },
    });

    //delete the comments
    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: "Comment deleted successfully" });
  }),
};

module.exports = commentController;
