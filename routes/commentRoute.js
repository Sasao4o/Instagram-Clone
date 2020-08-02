const express = require("express");
const router = express.Router();
//Requirments
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const commentController = require("../controllers/commentController");
const multiFactorAuth = require("../controllers/multiFactorAuth");
const oauthController = require("../controllers/oauthController");
//Here we protect the hall router
router.use(authController.protectRoute);
router.post("/:postId", commentController.createComment)
      .post("/:commentId/like", commentController.likeComment)
      .post("/:commentId/dislike", commentController.dislikeComment)
      .patch("/:id", commentController.updateComment);
router.get("/", commentController.getComments)
      .get("/:id", commentController.getComment);
router.delete("/:id", commentController.deleteComment);



module.exports = router;