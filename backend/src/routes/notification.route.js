const express = require("express");
const { isAuth } = require("../middlewares/iaAuth.middleware");
const {
  getNotifications,
  deleteNotification,
} = require("../controllers/notification.controller");

const notificationRouter = express.Router();

notificationRouter.get("/", isAuth, getNotifications);

notificationRouter.delete("/:notificationId", isAuth, deleteNotification);

module.exports = notificationRouter;
