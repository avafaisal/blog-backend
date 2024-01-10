const express = require('express')
const router = express.Router()

const Comment = require("../controllers/Comment");

router.get("/", Comment.getComments)
router.get("/:id", Comment.getCommentById)
router.get("/post/:id", Comment.getCommentByPost)
router.post("/", Comment.createComment)
router.delete("/:id", Comment.deleteComment)

module.exports = router