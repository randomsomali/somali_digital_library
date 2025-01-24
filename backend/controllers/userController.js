const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.getUserByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("usertoken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("usertoken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.json({ message: "Logged out successfully" });
};
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.getUserById(req.userId); // Assuming req.userId is set by your auth middleware
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.register = async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }

  const { username, password, phone } = req.body;

  try {
    const existingUser = await User.findUserByUsernameOrPhone(username, phone);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or phone already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPassword, phone };

    const result = await User.createUser(newUser);
    res
      .status(201)
      .json({ message: "User  registered successfully", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("Error retrieving users:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const { username, phone } = req.body;

  try {
    const updatedUser = { username, phone };
    const result = await User.updateUser(id, updatedUser);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User  not found" });
    }
    res.json({ message: "User  updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await User.deleteUser(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User  not found" });
    }
    res.json({ message: "User  deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
