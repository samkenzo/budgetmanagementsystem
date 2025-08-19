import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

const errorMessage = "Please login again!";

const authMiddleware =async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send({ error: errorMessage });
  try {
    const data = jwt.verify(token, JWT_SECRET);
    console.log(data);
    req.user = data.user;
    next();
  } catch (err) {
    res.status(401).send({ error: errorMessage });
  }
};

export default authMiddleware;