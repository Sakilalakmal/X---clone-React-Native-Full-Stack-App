const express = require("express");
const {
  getUserProfile,
  updateProfile,
  syncUser,
  getCurrentUser,
  followUser,
} = require("../controllers/user.controller");
const { isAuth } = require("../middlewares/iaAuth.middleware");
const userRouter = express.Router();

userRouter.get("/profile/:username", getUserProfile);

userRouter.post("/sync", isAuth, syncUser);

userRouter.put("/profile", isAuth, updateProfile);

userRouter.get("/me", isAuth, getCurrentUser);

userRouter.post("/follow/:targetUserId", isAuth, followUser);

module.exports = userRouter;
