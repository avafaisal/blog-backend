const express = require('express')
const router = express.Router()

const Post = require("../controllers/PostGenerator")

router.post("/", Post.postGenerator)

module.exports = router