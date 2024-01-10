const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 255,
  },
});

categorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Category", categorySchema);
