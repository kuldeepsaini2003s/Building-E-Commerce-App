import { uploadOnCloudinary } from "../utils/uploadToCloudinary.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcrypt";
import { sendMail } from "../utils/sendMail.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import { User } from "../model/UserModel.js";

const generateAccessAndRefreshToken = (user) => {
  const accessToken = generateToken(user, "10d");
  const refreshToken = generateToken(user, "10d");
  return { accessToken, refreshToken };
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const createActivationToken = (otp, userData) => {
  const payload = { otp: otp, userData: userData };
  const secret = process.env.JWT_SECRET;
  const option = { expiresIn: "10m" };
  return jwt.sign(payload, secret, option);
};

export const option = {
  httpOnly: true,
  path: "/",
};

const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const avatarFile = req.file;

    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        msg: "All fields are required",
      });
    }

    if (!avatarFile) {
      return res.status(400).json({
        success: false,
        msg: "Avatar image is required",
      });
    }

    const existingUser = await User.findOne({ email });

    const existingUserName = await User.findOne({ username });

    if (existingUser) {
      fs.unlinkSync(avatarFile.path);
      return res.status(400).json({
        success: false,
        msg: "User already exist with this email.",
      });
    }

    if (existingUserName) {
      fs.unlinkSync(avatarFile.path);
      return res.status(400).json({
        success: false,
        msg: "Username already used choose a different one.",
      });
    }

    const avatarURL = await uploadOnCloudinary(avatarFile?.path);

    const passwordHash = await bcrypt.hash(password, 10);

    const userData = {
      email,
      username,
      password: passwordHash,
      avatar: avatarURL.secure_url,
    };

    if (userData) {
      const otp = generateOTP();
      const activation_Token = createActivationToken(otp, userData);
      await sendMail({
        email: userData.email,
        subject: "Activate your account",
        message: `Hello ${userData.username}, \n\nThis is your OTP to activate your E-Commerce account: ${otp}`,
      });

      return res.status(200).json({
        success: true,
        activation_Token: activation_Token,
        msg: `please check your email:- ${userData.email} to activate your account!`,
      });
    }
  } catch (error) {
    console.log("Error while registering user", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

const activeUser = async (req, res) => {
  try {
    const { activation_otp } = req.body;
    const authHeader = req.headers["authorization"];
    const verificationToken = authHeader && authHeader.split(" ")[1];
    const tokenVerification = await jwt.verify(
      verificationToken,
      process.env.JWT_SECRET
    );

    if (!tokenVerification) {
      return res.status(400).json({
        success: false,
        msg: "Invalid Token",
      });
    }

    const { userData } = tokenVerification;

    const { email } = userData;

    let userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        msg: "User already exists",
      });
    }

    const otp = tokenVerification?.otp;

    if (!otp === activation_otp) {
      return res.status(400).json({
        success: false,
        msg: "You entered a Wrong OTP",
      });
    }

    const user = await User.create(userData);

    if (user) {
      const { accessToken, refreshToken } = generateAccessAndRefreshToken(user);

      const _user = await User.findByIdAndUpdate(
        user._id,
        {
          refreshToken,
        },
        { new: true }
      ).select("-password -refreshToken");

      await sendMail({
        email: userData.email,
        subject: "Welcome to E-Commerce",
        message: `Hi ${user.username},\n\nWe're excited to welcome you to E-Commerce! Your registration was successful, and we look forward to seeing you thrive with us.`,
      });

      return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json({
          success: true,
          validation: "OTP validated successfully",
          msg: "OTP verified! Account created successfully.",
          data: _user,
          accessToken,
          refreshToken,
        });
    }
  } catch (error) {
    console.log("Error while activating user", error);
    return res.status(500).json({
      success: false,
      msg: "It seems like you have a wrong Activation token",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found with this email.",
      });
    }

    const otp = generateOTP();
    const resetPasswordToken = createActivationToken(otp, user);

    await sendMail({
      email: user.email,
      subject: "Password Reset Request",
      message: `Hello ${user.username},\n\n your OTP to reset the password for your account is ${otp}.`,
    });

    return res.status(200).json({
      success: true,
      msg: `An OTP has been sent to ${email}`,
      resetToken: resetPasswordToken,
    });
  } catch (error) {
    console.log("Error in forgot password", error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { activation_otp, password } = req.body;
    const authHeader = req.headers["authorization"];
    const verificationToken = authHeader && authHeader.split(" ")[1];
    const tokenVerification = await jwt.verify(
      verificationToken,
      process.env.JWT_SECRET
    );

    if (!tokenVerification) {
      return res.status(400).json({
        success: false,
        msg: "Invalid Token",
      });
    }

    const otp = tokenVerification.otp;

    if (!otp === activation_otp) {
      return res.status(400).json({
        success: false,
        msg: "Invalid OTP",
      });
    }

    const { userData } = tokenVerification;

    const { email } = userData;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "User not found",
      });
    }

    const samePassword = await bcrypt.compare(password, user.password);

    if (samePassword) {
      return res.status(400).json({
        success: false,
        msg: "New password cannot be the same as the old password.",
      });
    }

    const newPassword = await bcrypt.hash(password, 10);

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      msg: "Password updated successfully",
    });
  } catch (error) {
    console.log("Error while verifying password", error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        msg: "please provide all fields",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found with this email",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(403).json({
        success: false,
        msg: "Invalid password try again",
      });
    }

    const { accessToken, refreshToken } = generateAccessAndRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const userData = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", refreshToken, option)
      .json({
        success: true,
        data: userData,
        accessToken,
        refreshToken,
        msg: "Login successful! Welcome back.",
      });
  } catch (error) {
    console.log("Error while logging in user", error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong",
    });
  }
};

const logoutUser = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { refreshToken: undefined },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json({ success: false, msg: "User logged out successfully" });
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
      msg: "User details fetch successfully",
    });
  } catch (error) {
    console.log("Error while getting user details", error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong",
    });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const token =
      req.cookies.refreshToken || req.header("authorization")?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "unauthorized request" });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (token !== user.refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "refresh token is not valid" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", refreshToken, option)
      .json({ success: true, accessToken, refreshToken });
  } catch (error) {
    console.log("Error refreshing access token", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

export {
  register,
  activeUser,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  loginUser,
  logoutUser,
  getUser,
};
