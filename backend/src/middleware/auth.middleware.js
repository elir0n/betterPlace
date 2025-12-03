import jwt from "jsonwebtoken";

export const authCheck = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header)
      return res.status(401).json({ error: "No token provided" });

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id: ... }
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
