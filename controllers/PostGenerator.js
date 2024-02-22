const Post = require("../models/Post");
const slugify = require("slugify");
const axios = require("axios");

const postGenerator = async (req, res) => {
  let title = req.body.title;
  let category = req.body.category;

  await axios
    .post("https://prickly-bikini-ray.cyclic.app/generate", { keyword: title })
    .then((result) => {
      const createPost = new Post({
        title: title,
        content: result.data.content,
        description: result.data.description,
        category: category,
        slug: slugify(title),
        image: result.data.image,
        imageUrl: result.data.image,
      });
      createPost.save();
      res.status(201).json({ message: "Post genarator successfully" });
    })
    .catch((error) => {
      res.json({ message: error.message });
    });
};

module.exports = {
  postGenerator,
};
