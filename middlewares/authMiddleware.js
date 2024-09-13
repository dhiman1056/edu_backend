import jwt from "jsonwebtoken";

const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded.userId;
      console.log(req.user);
      next();
    } catch (err) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token." });
    }
  } else {
    res
      .status(401)
      .json({ success: false, message: "Authorization token is required." });
  }
};

export default validateToken;
