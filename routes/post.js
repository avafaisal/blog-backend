const express = require("express");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, "public/images/"); 
    cb(null, './tmp/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

const Post = require("../controllers/Post");

router.get("/", Post.getPosts);
router.get("/:id", Post.getPostById);
router.get("/categoryname/:name", Post.getPostByCategoryName);
router.post("/", upload.single("image"), Post.createPost);
router.put("/:id", upload.single("image"), Post.updatePost);
router.patch("/:id", upload.single("image"), Post.updatePost);
router.delete("/:id", Post.deletePost);

module.exports = router;
