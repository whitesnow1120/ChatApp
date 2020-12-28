const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const keys = require("../config/keys");
const verify = require("../utils/verifyToken");
const User = require("../models/User");

/**
 * Home
 * @param { Object } req
 * @param { Object } res
 * @method GET
 */
const Home = (req, res) => {
  try {
    let jwtUser = jwt.verify(verify(req), keys.secretOrKey);
    let id = mongoose.Types.ObjectId(jwtUser.id);

    User.aggregate()
      .match({ _id: { $not: { $eq: id } } })
      .project({ password: 0, __v: 0, date: 0 })
      .exec((err, users) => {
        if (err) {
          console.log(err);
          res.status(500);
        } else {
          res.send(users);
        }
      });
  } catch (err) {
    console.log(err);
    res.setHeader("Content-Type", "application/json");
    res.status(401).json({ message: "Unauthorized" });
  }
};

/**
 * Register
 * @param { Object } req
 * @param { Object } res
 * @method POST
 */
const Register = (req, res) => {
  try {
    User.findOne({ username: req.body.username }).then((user) => {
      if (user) {
        return res.status(400).json({ message: "Username already exists" });
      } else {
        const newUser = new User({
          name: req.body.name,
          username: req.body.username,
          password: req.body.password,
        });
        // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              throw err;
            } else {
              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                  const payload = {
                    id: user.id,
                    name: user.name,
                  };
                  // Sign token
                  jwt.sign(
                    payload,
                    keys.secretOrKey,
                    { expiresIn: 31556926 },
                    (err, token) => {
                      if (err) {
                        console.log("err", err);
                      } else {
                        req.io.sockets.emit("users", user.username);
                        res.json({
                          success: true,
                          token: "Bearer " + token,
                          name: user.name,
                        });
                      }
                    },
                  );
                })
                .catch((err) => {
                  console.log("err", err);
                });
            }
          });
        });
      }
    });
  } catch (err) {
    console.log("err", err);
    res.sendStatus(500);
  }
};

/**
 * Login
 * @param { Object } req
 * @param { Object } res
 * @method POST
 */
const Login = (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    // Find user by username
    User.findOne({ username }).then((user) => {
      // Check if user exists
      if (!user) {
        return res.status(404).json({ message: "Username not found" });
      }
      // Check password
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          return res.status(400).json({ message: "Password incorrect" });
        } else {
          // User matched
          // Create JWT payload
          const payload = {
            id: user.id,
            name: user.name,
          };
          // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926, // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
                name: user.name,
                username: user.username,
                userId: user._id,
              });
            },
          );
        }
      });
    });
  } catch (err) {
    console.log("err", err);
    res.status(500);
  }
};

module.exports = {
  Home,
  Register,
  Login,
};
