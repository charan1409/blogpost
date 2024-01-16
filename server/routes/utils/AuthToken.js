const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.Authorization || req.headers.authorization;
  if (!token) return res.status(201).json({ message: "No token provided" });
  jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
    if (err) return res.status(201).json({ message: "Invalid token" });
    req.userId = decoded.id;
    next();
  });
};

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.SECRET_TOKEN, {
    expiresIn: 86400,
  });
};

module.exports = { verifyToken, generateToken };
