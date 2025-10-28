const { get, ModifiedPathsSnapshot } = require("mongoose");
const AsyncHandler = require("express-async-handler");
const User = require("../models/user.model");
const { getAuth, clerkClient } = require("@clerk/express");
const Notification = require("../models/notification.model");

const userControllers = {
  getUserProfile: AsyncHandler(async (req, res) => {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        message: "user Not Found",
      });
    }

    res.status(200).json({
      user,
    });
  }),

  updateProfile: AsyncHandler(async (req, res) => {
    const { userId } = getAuth(req);

    const user = await User.findOneAndUpdate({ clerkId: userId }, req.body, {
      new: true,
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      user,
    });
  }),

  syncUser: AsyncHandler(async (req, res) => {
    const { userId } = getAuth(req);

    // Check if user already exists
    const existingUser = await User.findOne({ clerkId: userId });

    if (existingUser) {
      return res
        .status(500)
        .json({ message: "User already exists", user: existingUser });
    }

    //create new user

    const clerkUser = await clerkClient.users.getUser(userId);

    const userData = {
      clerkId: userId,
      username: clerkUser.emailAddresses[0]?.emailAddress.split("@")[0] || "",
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      firstName: clerkUser.firstName || "",
      lastName: clerkUser.lastName || "",
      profileImage: clerkUser.imageUrl || "",
    };

    const newUser = await User.create(userData);

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  }),

  getCurrentUser: AsyncHandler(async (req, res) => {
    const { userId } = getAuth(req);

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  }),

  followUser: AsyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { targetUserId } = req.params;

    if (userId === targetUserId)
      return res.status(400).json({ message: "You cannot follow yourself" });

    const currentUser = await User.findOne({ clerkId: userId });

    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isAlreadyFollowing = currentUser.following.includes(targetUserId);

    if (isAlreadyFollowing) {
      //unfollow

      await User.findByIdAndUpdate(currentUser._id, {
        $pull: { following: targetUserId },
      });

      await User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: currentUser._id },
      });
    } else {
      //follow
      await User.findByIdAndUpdate(currentUser._id, {
        $push: { following: targetUserId },
      });

      await User.findByIdAndUpdate(targetUserId, {
        $push: { followers: currentUser._id },
      });
    }

    //send notification
    await Notification.create({
      from: currentUser._id,
      to: targetUserId,
      type: "follow",
    });

    res.status(200).json({
      message: isAlreadyFollowing
        ? "Unfollowed user successfully"
        : "Followed user successfully",
    });
  }),
};

module.exports = userControllers;
