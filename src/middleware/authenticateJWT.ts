const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(403).json({ statusCode: 403, message: "Invalid token" });
  
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ statusCode: 403, message: "Invalid token" });
    req.user = user;
    next();
  });
};

module.exports = authenticateJWT;
