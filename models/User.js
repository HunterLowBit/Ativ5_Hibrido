const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "insira um email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Insira um email valido"],
  },
  password: {
    type: String,
    required: [true, "Insira uma senha"],
    minlength: [8, "quantidade minima de 8 caracteres"],
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Senha incorreta");
  }
  throw Error("Email incorreto");
};

const User = mongoose.model("user", userSchema);

module.exports = User;
