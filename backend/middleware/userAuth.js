const jwt = require("jsonwebtoken");

module.exports.userAuth = (req, res, next) => {
  const { token } = req.cookies;
  console.log("Cookies received:", req.cookies);
  console.log("Token:", token);

  if (!token) {
    return res.json({success: false, message: "Not authorized. Please login again"});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res.json({success: false, message: "Not authorized. Invalid token"});
    }

    req.userId = decoded.id;
    next();  

  } catch (err) {
    return res.json({success: false, message: "Not authorized. Token expired or invalid"});
  }
};
