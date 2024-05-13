const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "HLBDEV", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    console.log("no token");
  }
};

const checkUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "HLBDEV", async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        console.log("[checkUser] res.locals.user", res.locals.user);
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user.email;
        console.log("[checkUser] res.locals.user", res.locals.user);
        next();
      }
    });
  } else {
    res.locals.user = null;
    console.log("[checkUser] res.locals.user", res.locals.user);
    next();
  }
};


module.exports = { requireAuth, checkUser };
