const express = require("express");
const router = express.Router();
//Requirments
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");
const multiFactorAuth = require("../controllers/multiFactorAuth");
const oauthController = require("../controllers/oauthController");

router.use(authController.protectRoute);
router.post("/", userController.upload,  userController.resizePostPhoto, postController.createPost)
      // .get("/my", postController.getMyPosts)
      .post("/:postId/like", postController.likePost)
      .delete("/:postId/dislike", postController.dislikePost)
      .patch("/", postController.updatePost)
      .get("/", postController.getPosts)
     
     

      router
      .get("/:id", postController.getPost)
      .delete("/:id", postController.deletePost);



module.exports = router;