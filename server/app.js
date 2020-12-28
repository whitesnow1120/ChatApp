const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const dotenv = require("dotenv");
const socket = require("socket.io");
dotenv.config();

const users = require("./routes/users");

const app = express();

// Port that the webserver listens to
const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`App is running on ${port}`);
});

// Socket setup
const io = socket(server);

io.on("connection", function (socket) {
  console.log("Made socket connection");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS middleware
app.use(cors());

// Database configuration
const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Successfully Connected"))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);


// Assign socket object to every request
app.use(function (req, res, next) {
  req.io = io;
  next();
});

// Routes
app.use("/users", users);

module.exports = app;
