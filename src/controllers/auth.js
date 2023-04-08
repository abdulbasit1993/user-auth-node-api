const config = require("../config/auth");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user
    .save()
    .then((user) => {
      if (req.body.roles) {
        Role.find({ name: { $in: req.body.roles } })
          .then((roles) => {
            user.roles = roles.map((role) => role._id);
            user
              .save()
              .then(() => {
                res.send({ message: "User was registered successfully" });
              })
              .catch((err) => {
                res.status(500).send({ message: err });
              });
          })
          .catch((err) => {
            res.status(500).send({ message: err });
          });
      } else {
        Role.findOne({ name: "user" })
          .then((role) => {
            user.roles = [role._id];
            user
              .save()
              .then(() => {
                res.send({ message: "User was registered successfully" });
              })
              .catch((err) => {
                res.status(500).send({ message: err });
              });
          })
          .catch((err) => {
            res.status(500).send({ message: err });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};
