const Admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.getAdminByUsername(username);

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("admintoken", token, {
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
  res.clearCookie("admintoken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.json({ message: "Logged out successfully" });
};
exports.getCurrentAdmin = async (req, res) => {
  try {
    const admin = await Admin.getAdminById(req.userId); // Assuming req.userId is set by your auth middleware
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.getAllAdmins();
    res.json(admins);
  } catch (err) {
    console.error("Error retrieving admins:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createAdmin = [
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty())
    //   return res.status(400).json({ errors: errors.array() });

    const { full_name, username, password, phone, role } = req.body;

    try {
      const existingAdmin = await Admin.getAdminByUsername(username);
      if (existingAdmin) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = {
        full_name,
        username,
        password: hashedPassword,
        phone,
        role,
      };

      const result = await Admin.createAdmin(newAdmin);
      res
        .status(201)
        .json({ message: "Admin created successfully", id: result.insertId });
    } catch (err) {
      console.error("Error creating admin:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

exports.updateAdmin = async (req, res) => {
  const id = req.params.id;
  const { full_name, username, phone, role } = req.body;

  try {
    const updatedAdmin = { full_name, username, phone, role };
    const result = await Admin.updateAdmin(id, updatedAdmin);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({ message: "Admin updated successfully" });
  } catch (err) {
    console.error("Error updating admin:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteAdmin = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Admin.deleteAdmin(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    console.error("Error deleting admin:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
