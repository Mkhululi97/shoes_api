import jwt from "jsonwebtoken";

function hideEndpoint(req, res, next) {
  const jwtkey = process.env.JWT_KEY;
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, jwtkey);
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
}

export default hideEndpoint;
