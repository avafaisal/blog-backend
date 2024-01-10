const fs = require("fs");
const path = require("path");
const Category = require("../models/Category");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const slugify = require("slugify");

// GET ALL
const getPosts = async (req, res) => {
  const title = req.query.title;
  const slug = req.query.slug;
  const category = req.query.category;
  const paging = Boolean(req.query.paging) || Boolean(false);
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const options = {
    populate: "category",
    // sort: { createdAt: -1 },
    page: page,
    limit: limit,
  };

  // GET POST BY SLUG
  if (slug !== undefined) {
    try {
      const post = await Post.findOne()
        .select(
          "_id title category content description image imageUrl slug createdAt"
        )
        .where("slug")
        .equals(slug)
        .populate({ path: "category", select: "_id name" });
      res.status(200).json(post);
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }

    // GET POST BY CATEGORY ID
  } else if (category !== undefined) {
    try {
      if (paging) {
        const posts = await Post.paginate(
          {
            category: category,
          },
          options
        );
        res.status(200).json(posts);
      } else {
        const posts = await Post.find()
          .select(
            "_id title category content description image imageUrl slug createdAt"
          )
          .where("category")
          .equals(category)
          .populate({ path: "category", select: "_id name" })
          .sort("-createdAt");
        res.status(200).json({
          docs: posts,
          totalDocs: posts.length
        });
      }
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }

    // GET ALL POST & GET POST BY TITLE
  } else {
    let condition = title
      ? { title: { $regex: new RegExp(title), $options: "i" } }
      : {};

    try {
      if (paging) {
        const posts = await Post.paginate(condition, options);
        res.status(200).json(posts);
      } else {
        const posts = await Post.find(condition)
          .select(
            "_id title category content description image imageUrl slug createdAt"
          )
          .populate({ path: "category", select: "_id name" })
          .sort("-createdAt");
        res.status(200).json({
          docs: posts,
          totalDocs: posts.length
        });
      }
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
};

// GET POST BY ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.params.id })
      .select(
        "_id title category content description image imageUrl slug createdAt"
      )
      .populate({ path: "category", select: "_id name" });
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// GET POST BY CATEGORY NAME
const getPostByCategoryName = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const options = {
    populate: "category",
    // sort: { createdAt: -1 },
    page: page,
    limit: limit,
  };

  // Get Category Id
  const name = req.params.name;
  const categories = await Category.find({
    name: { $regex: new RegExp(name), $options: "i" },
  });
  const categoryId = categories[0]._id;

  try {
    const posts = await Post.paginate(
      {
        category: categoryId,
      },
      options
    );
    res.status(200).json(posts);
    
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// CREATE
const createPost = async (req, res) => {
  if (req.files === null)
    return res.status(400).json({ message: "No File Uploaded" });

  const file = req.files.image;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ message: "Invalid Images" });
  if (fileSize > 5000000)
    return res.status(422).json({ message: "Image must be less than 5 MB" });

  file.mv(`./public/images/${fileName}`, async (error) => {
    if (error) return res.status(500).json({ message: error.message });
    try {
      const createPost = new Post({
        title: req.body.title,
        content: req.body.content,
        description: req.body.description,
        category: req.body.category,
        slug: slugify(req.body.title).toLowerCase(),
        image: fileName,
        imageUrl: url,
      });
      await createPost.save();
      res.status(201).json({
        message: "Post created successfuly",
        data: createPost,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

// UPDATE
const updatePost = async (req, res) => {
  const post = await Post.findById({ _id: req.params.id });
  if (!post) return res.status(404).json({ message: "No Data Found" });

  let fileName = "";

  if (req.files === null) {
    fileName = post.image;
  } else {
    const file = req.files.image;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ message: "Invalid Images" });
    if (fileSize > 5000000)
      return res.status(422).json({ message: "Image must be less than 5 MB" });

    const filepath = `./public/images/${post.image}`;
    fs.unlinkSync(filepath);
    file.mv(`./public/images/${fileName}`, (error) => {
      if (error) return res.status(500).json({ message: error.message });
    });
  }

  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  try {
    await Post.updateOne(
      { _id: req.params.id },
      {
        title: req.body.title,
        content: req.body.content,
        description: req.body.description,
        category: req.body.category,
        slug: slugify(req.body.title).toLowerCase(),
        image: fileName,
        imageUrl: url,
      }
    );
    res.status(201).json({
      message: "Post updated successfuly",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
const deletePost = async (req, res) => {
  try {
    // Delete Post by id
    await Post.deleteOne({ _id: req.params.id });
    // Delete All Comment by Post id
    await Comment.deleteMany({ post: req.params.id });
    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  getPosts,
  getPostById,
  getPostByCategoryName,
  createPost,
  updatePost,
  deletePost,
};
