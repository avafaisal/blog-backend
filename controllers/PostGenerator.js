const Post = require("../models/Post");
const slugify = require("slugify");
const axios = require("axios");

const postGenerator = async (req, res) => {
  let keyword = req.body.keyword.replace(" ", "-");
  let category = req.body.category;
  let title = req.body.keyword

  try {
    const response = await axios.get(
      `https://prickly-bikini-ray.cyclic.app/generator/${keyword}`
    );
    const result = response.data

    if (result) {
      const createPost = new Post({
        title: title,
        content: result.content,
        description: result.description,
        category: category,
        slug: slugify(title),
        image: result.image,
        imageUrl: result.image,
      });
      createPost.save();
      res.status(201).json({ data: result });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports = {
  postGenerator,
};
