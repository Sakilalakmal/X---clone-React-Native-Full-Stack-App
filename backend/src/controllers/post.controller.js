const AsyncHandler = require("express-async-handler");
const Post = require("../models/post.model");
const User = require("../models/user.model");
const Comment = require("../models/comment.model");
const { getAuth } = require("@clerk/express");
const Notification = require("../models/notification.model");

const postControllers = {
  getAllPosts: AsyncHandler(async (req, res) => {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "username firstName lastName profileImage")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username firstName lastName profileImage",
        },
      });

    res.status(200).json({ posts });
  }),

  getPostById: AsyncHandler(async (req, res) => {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate("user", "username firstName lastName profileImage")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username firstName lastName profileImage",
        },
      });

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json({ post });
  }),

  getpostByUsername: AsyncHandler(async (req, res) => {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate("user", "username firstName lastName profileImage")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username firstName lastName profileImage",
        },
      });

    res.status(200).json({ posts });
  }),

  createPost: AsyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { content } = req.body;
    const imageFile = req.file;

    if (!content && !imageFile) {
      return res
        .status(400)
        .json({ message: "Post content or image is required" });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Please register to create a post..." });
    }

    const image = req.file ? req.file.path : null;

    const newPost = new Post({
      user: user._id,
      content: content || "",
      image,
    });

    await newPost.save();

    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  }),

  likedPost: AsyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { postId } = req.params;

    const user = await User.findOne({ clerkId: userId });

    const post = await Post.findById(postId);

    if (!user || !post) {
      return res
        .status(404)
        .json({ message: "User and Post not found Try again later" });
    }

    if (user._id.toString() === post.user.toString()) {
      return res.status(400).json({ message: "You cannot like your own post" });
    }

    const isLiked = post.likes.includes(user._id);

    if (isLiked) {
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: user._id },
      });
    } else {
      await Post.findByIdAndUpdate(postId, {
        $push: { likes: user._id },
      });
    }

    //create notification for post owner
    await Notification.create({
      from: user._id,
      to: post.user,
      type: "like",
      post: postId,
    });

    res
      .status(200)
      .json({ message: isLiked ? "Unlike the Post" : "Like the Post" });
  }),

  deletePost: AsyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { postId } = req.params;

    const user = await User.findOne({ clerkId: userId });
    const post = await Post.findById(postId);

    if (!user || !post) {
      return res.status(404).json({ message: "User or Post not found" });
    }

    if (post.user.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }

    //delete all comments associated with the post

    await Comment.deleteMany({ post: post._id });

    //delete the post
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  }),
};

module.exports = postControllers;
