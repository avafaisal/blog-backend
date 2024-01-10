const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongooseDateFormat = require("mongoose-date-format");
const mongoosePaginate = require("mongoose-paginate-v2");

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    max: 255,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  description: {
    type: String,
    required: true,
    max: 255,
  },
  slug: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

postSchema.plugin(mongooseDateFormat); // format: YYYY-MM-DD HH:mm:ss
postSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Post", postSchema);
