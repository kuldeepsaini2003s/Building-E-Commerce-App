import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter your name"],
      minLength: [3, "name must be at least 3 characters"],
      maxLength: [20, "name must be less than 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Enter your email address"],
    },
    password: {
      type: String,
      required: [true, "Enter your password"],
      minLength: [8, "password must be at least 8 characters"],
      maxLength: [20, "password must be less than 20 characters"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ],
    },
  },
  { timestamps: true }      
);

export const User = mongoose.model("User", userSchema);
