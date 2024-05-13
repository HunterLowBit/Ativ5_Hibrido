const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

const app = express();

app.use(express.json());

const dbURI =
  "mongodb+srv://robsonpereira98:hlbdev1@hlbdev1.le63zst.mongodb.net/?retryWrites=true&w=majority&appName=hlbdev1";
mongoose
  .connect(dbURI, {})
  .then((result) => app.listen(3000))
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.log(err));

app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.use(authRoutes);

console.log("app listening on port 3000, http://localhost:3000");
