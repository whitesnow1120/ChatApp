const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.Home);
router.post("/login", userController.Login);
router.post("/register", userController.Register);

module.exports = router;
