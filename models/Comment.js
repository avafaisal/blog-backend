const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongooseDateFormat = require("mongoose-date-format");
const mongoosePaginate = require("mongoose-paginate-v2");

const commentSchema = mongoose.Schema({
  comment: {
    type: String,
    required: true,
    max: 255,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

commentSchema.plugin(mongooseDateFormat); // format: YYYY-MM-DD HH:mm:ss
commentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Comment", commentSchema);
