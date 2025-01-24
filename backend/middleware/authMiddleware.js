const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.usertoken || req.cookies.admintoken;
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

exports.verifyTokenAndRole = (role) => {
  return (req, res, next) => {
    this.verifyToken(req, res, () => {
      if (req.userRole !== role) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    });
  };
};
