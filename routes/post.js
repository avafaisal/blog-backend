const express = require("express");

const router = express.Router();

const Post = require("../controllers/Post");

router.get("/", Post.getPosts);
router.get("/:id", Post.getPostById);
router.get("/categoryname/:name", Post.getPostByCategoryName);
router.post("/", Post.createPost);
router.put("/:id", Post.updatePost);
router.patch("/:id", Post.updatePost);
router.delete("/:id", Post.deletePost);

module.exports = router;
