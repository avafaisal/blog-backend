const Comment = require("../models/Comment");

// GET ALL
const getComments = async (req, res) => {
  const paging = Boolean(req.query.paging) || Boolean(false);
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const options = {
    populate: "post",
    sort: { createdAt: -1 },
    page: page,
    limit: limit,
  };
  try {
    if (paging) {
      const comments = await Comment.paginate({}, options);
      res.status(200).json(comments);
    } else {
      const comments = await Comment.find()
        .select("_id comment post createdAt")
        .populate({ path: "post", select: "_id title" });
      res.status(200).json({
        docs: comments,
        totalDocs: comments.length,
      });
    }
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

// GET ONE
const getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById({ _id: req.params.id })
      .select("_id comment post")
      .populate({ path: "post", select: "_id title" });
    res.status(200).json(comment);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

// GET BY POST
const getCommentByPost = async (req, res) => {
  try {
    const comment = await Comment.find({ post: req.params.id })
      .select("_id comment post")
      .sort("-createdAt")
      .populate({ path: "post", select: "_id title" });
    res.status(200).json({
      docs: comment,
      totalDocs: comment.length,
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

// CREATE
const createComment = async (req, res) => {
  const commentPost = new Comment({
    comment: req.body.comment,
    post: req.body.post,
  });

  try {
    const comment = await commentPost.save();
    res.status(201).json({
      message: "Comment created successfuly",
      data: comment,
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

// DELETE
const deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

module.exports = {
  getComments,
  getCommentById,
  getCommentByPost,
  createComment,
  deleteComment,
};
