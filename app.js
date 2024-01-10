const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", true);
const bodyParser = require("body-parser");
// const FileUpload = require("express-fileupload");
const cors = require("cors");
const morgan = require("morgan");
const port = process.env.PORT || 5000;
const DB_CONNECTION = process.env.DB_CONNECTION;

app.use(morgan('dev'));
// app.use(express.static("public"));
// app.use(express.static(__dirname + '/public'));
// app.use(FileUpload());

app.use(express.static(__dirname + '/tmp'));
app.use('./tmp', express.static('tmp'));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

// Import Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");
const postgenRoutes = require("./routes/postGenerator");

app.get("/", (req, res) => {
  res.send("REST API BLOG APP");
});
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/postgenerator", postgenRoutes);

// Connect DB
mongoose.connect(DB_CONNECTION, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
let db = mongoose.connection;

db.on("error", console.error.bind(console, "Database connection failed"));
db.once("open", () => {
  console.log("Database connection successful");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = app;
