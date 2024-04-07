const jwt = require("jsonwebtoken");

const verifytoken = (req, res, next) => {
  const authheader = req.headers.authorization;
  if (authheader) {
    const token = authheader.split(" ")[1];
    jwt.verify(token, "key", async (err, user) => {
      if (err) {
        res.status(403).json({ message: "invalid token" });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(400).json({ message: "NOT Authorized" });
  }
};

const verifytokenAndaAuthorization = (req, res, next) => {
  verifytoken(req, res, () => {
    if (
      req.user.usertype === "Customer" ||
      req.user.usertype === "Producer" ||
      req.user.usertype === "Admin" ||
      req.user.usertype === "Deleivery"
    ) {
      next();
    } else {
      res.status(403).json({ message: "Not Authorized" });
    }
  });
};

const verifyproducer = (req, res, next) => {
  verifytoken(req, res, () => {
    if (req.user.usertype === "Producer") {
      next();
    } else {
      res.status(403).json({ message: "Not Authorized" });
    }
  });
};
const verifyDeleivery = (req, res, next) => {
  verifytoken(req, res, () => {
    if (req.user.usertype === "Deleivery") {
      next();
    } else {
      res.status(403).json({ message: "Not Authorized" });
    }
  });
};
const verifyadmin = (req, res, next) => {
  verifytoken(req, res, () => {
    if (req.user.usertype === "Admin") {
      next();
    } else {
      res.status(403).json({ message: "Not Authorized" });
    }
  });
};

module.exports = {
  verifytoken,
  verifytokenAndaAuthorization,
  verifyDeleivery,
  verifyadmin,
  verifyproducer,
};
