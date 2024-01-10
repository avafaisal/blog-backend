const Post = require("../models/Post");
const slugify = require("slugify");
const axios = require("axios");

const trim_words = (theString, numWords) => {
  expString = theString.split(/\s+/, numWords);
  theNewString = expString.join(" ");
  return theNewString;
};

// SCRAPE DATA
const postGenerator = async (req, res) => {
  let keyword = req.body.keyword;
  let size = req.body.size;
  let category = req.body.category;

  await axios
    .get(
      `https://search.api.cnn.io/content?q=${keyword}&size=${size}&sort=relevance`
    )
    .then((result) => {
      data = result.data.result;

      for (i = 0; i < data.length; i++) {
        let headline = data[i]["headline"].replace(/[^a-zA-Z0-9 ]/g, "");
        let content = data[i]["body"].split(".").join(".<br><br>");
        const createPost = new Post({
          title: headline,
          content: content,
          description: trim_words(data[i]["body"], 20),
          category: category,
          slug: slugify(headline),
          imageUrl: data[i]["thumbnail"],
        });
        createPost.save();
      }

      // Success
      res.json({ message: "Post genarator successfully" });
    })
    .catch((error) => {
      res.json({ message: error.message });
    });
};

module.exports = {
  postGenerator,
};
