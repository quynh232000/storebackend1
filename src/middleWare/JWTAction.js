const jwt = require("jsonwebtoken");

const createJWT = (data) => {
  let token = null;
  try {
    token = jwt.sign(data, process.env.JWT_SECRET);
  } catch (e) {
    console.log(e);
  }

  return token;
};

const verifyToken = (token) => {
  let data = null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    data = decoded;
  } catch (e) {
    console.log(e);
  }
  return data;
};
const authorToken = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  // console.log("quynh", authorizationHeader);
  // return;
  const token = authorizationHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);
  const data = verifyToken(token);
  if (!data) return res.sendStatus(403);
  req.userId = data.userId;
  req.role = data.role;

  next();
};
const checkAdmin = (req, res, next) => {
  if (req.role !== "R1") {
    return res.status(200).json({
      errCode: 5,
      errMessage: "You're not admin!",
      linkDirect: "/admin/login",
    });
  } else {
    next();
  }
};
module.exports = { createJWT, verifyToken, authorToken, checkAdmin };
