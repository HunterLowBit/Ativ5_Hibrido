const { Router } = require("express");
const authController = require("../controllers/authController");

const router = Router();

router.get("/signup", (req, res) => {
  console.log("[authRoutes] signup_get");
  return authController.signup_get(req, res);
});
router.post("/signup", (req, res) => {
  console.log("[authRoutes] signup_post");
  return authController.signup_post(req, res);
});
router.get("/login", (req, res) => {
  console.log("[authRoutes] login_get");
  return authController.login_get(req, res);
});
router.post("/login", (req, res) => {
  console.log("[authRoutes] login_post");
  return authController.login_post(req, res);
});
router.get("/logout", (req, res) => {
  console.log("[authRoutes] logout_get");
  return authController.logout_get(req, res);
});

module.exports = router;
