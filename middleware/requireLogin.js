const jwt = require("jsonwebtoken");
const { jwt_SECRET } = require("../config/key");
const mongoose = require("mongoose");
const User = mongoose.model("Auth");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Please Login" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, jwt_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "Please Log In" });
    } else {
      const { _id } = payload;
      User.findById(_id)
        .then((userData) => {
          req.user = userData;
          next();
        })
        .catch((err) => console.log(err));
    }
  });
};
