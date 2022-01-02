const jwt = require("jsonwebtoken");

const VerifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.PASS_SEC_KEY, (error, user) => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(404).json("Invalid Token");
      }
    });
  } else {
    res.status(500).json("oops, You do not have a token");
  }
};

const VerifyUser = (req, res, next) => {
  VerifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(500).json("You are not allowed");
    }
  });
};

module.exports = { VerifyToken, VerifyUser };
