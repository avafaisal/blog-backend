const Category = require("../models/Category");

// GET ALL
const getCategories = async (req, res) => {
  const name = req.query.name;
  const paging = Boolean(req.query.paging) || Boolean(false);
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const options = {
    page: page,
    limit: limit,
  };
  let condition = name
    ? { name: { $regex: new RegExp(name), $options: "i" } }
    : {};

  try {
    if (paging) {
      const categories = await Category.paginate(condition, options);
      res.status(200).json(categories);
    } else {
      const categories = await Category.find(condition).select("_id name");
      res.status(200).json({
        docs: categories,
        totalDocs: categories.length
      });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};


// GET ONE
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById({ _id: req.params.id }).select(
      "_id name"
    );
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

// CREATE
const createCategory = async (req, res) => {
  try {
    const data = new Category({
      name: req.body.name,
    });
    const category = await data.save();
    res.status(201).json({
      message: "Category created successfuly",
      data: category,
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

// UPDATE
const updateCategory = async (req, res) => {
  try {
    const data = req.body;
    const options = { new: true };

    await Category.findByIdAndUpdate(req.params.id, data, options);
    res.status(201).json({
      message: "Category updated successfuly",
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

// DELETE
const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Category deleted successfuly",
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
