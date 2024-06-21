const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserShema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please username cannot be empty"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters long"],
    validate: {
      validator: function (v) {
        // Regex pattern for validating password
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid password! Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.`,
    },
  },
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const user = mongoose.model("Users", UserShema);
module.exports = user;


