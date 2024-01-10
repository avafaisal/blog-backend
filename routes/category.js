const express = require("express");
const router = express.Router();

const Category = require("../controllers/Category");

router.get("/", Category.getCategories);
router.get("/:id", Category.getCategoryById);
router.post("/", Category.createCategory);
router.put("/:id", Category.updateCategory);
router.patch("/:id", Category.updateCategory);
router.delete("/:id", Category.deleteCategory);

module.exports = router;
