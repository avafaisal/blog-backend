const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "SecretKey1234";

// Import User Model
const User = require("../models/User");

// Register
const registerUser = async (req, res) => {
  // if email exist
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).json({
      status: res.statusCode,
      message: "Email already used",
    });

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  // create user
  try {
    const saveUser = await user.save();
    res.status(201).json(saveUser);
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      message: "Failed to create a new user",
    });
  }
};

// Login
const loginUser = async (req, res) => {
  // check email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).json({
      status: res.statusCode,
      message: "Your email is wrong!",
    });

  // check password
  const validPwd = await bcrypt.compare(req.body.password, user.password);
  if (!validPwd)
    return res.status(400).json({
      status: res.statusCode,
      message: "Your password is wrong!",
    });

  // Create token with JWT
  const token = jwt.sign({ _id: user._id }, SECRET_KEY);
  res.header("auth-token", token).json({
    token: token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

// GET ALL
const getUsers = async (req, res) => {
  try {
    const user = await User.find().select("_id name email");
    res.json({
      users: user,
      total_users: user.length,
    });
  } catch (error) {
    res.json({ message: error });
  }
};

// GET ONE
const getUserById = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.userId }).select(
      "_id name email"
    );
    res.json(user);
  } catch (error) {
    res.json({ message: error });
  }
};

// CREATE
const createUser = async (req, res) => {
  // if email exist
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).json({
      status: res.statusCode,
      message: "Email Already used !",
    });

  const userPost = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });
  try {
    const user = await userPost.save();
    res.json({
      message: "User created successfuly",
      data: user
    });
  } catch (error) {
    res.json({ message: error });
  }
};

// UPDATE
const updateUser = async (req, res) => {
  // if email exist
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).json({
      status: res.statusCode,
      message: "Email Already used !",
    });

  try {
    const userUpdate = await User.updateOne(
      { _id: req.params.userId },
      {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
      }
    );
    const user = await User.findById({ _id: req.params.userId });
    res.json(user);
  } catch (error) {
    res.json({ message: error });
  }
};

// DELETE
const deleteUser = async (req, res) => {
  try {
    const userUpdate = await User.deleteOne({ _id: req.params.userId });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.json({ message: error });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
