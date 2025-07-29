import jwt from "jsonwebtoken";
const JWT_SECRET = "SaintMSGInsan";

const errorMessage = "Please authenticate using a valid token!";

const authMiddleware = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) res.status(401).send({ error: errorMessage });
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (err) {
    res.status(401).send({ error: errorMessage });
  }
};

export default authMiddleware;