import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcrypt";
import { sendMail } from "../utils/sendMail.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import { option } from "./UserController.js";
import { uploadOnCloudinary } from "../utils/uploadToCloudinary.js";
import { Shop } from "../model/ShopModel.js";
import { Product } from "../model/ProductModel.js";

const generateAccessAndRefreshToken = (shop) => {
  const accessToken = generateToken(shop, "10d");
  const refreshToken = generateToken(shop, "10d");
  return { accessToken, refreshToken };
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const createActivationToken = (otp, shopData) => {
  const payload = { otp, shopData };
  const secret = process.env.JWT_SECRET;
  const option = { expiresIn: "10m" }; // 10 minutes
  return jwt.sign(payload, secret, option);
};

const cookieOptions = {
  httpOnly: true,
  path: "/",
};

const createShop = async (req, res) => {
  try {
    const { name, password, phone, address, pinCode, email } = req.body;
    const avatarFile = req.file;

    if (!name || !password || !email || !address || !pinCode || !phone) {
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

    const existingShop = await Shop.findOne({ email });
    if (existingShop) {
      fs.unlinkSync(avatarFile.path); // Clean up uploaded file
      return res.status(400).json({
        success: false,
        msg: "Shop already exists with this email.",
      });
    }

    const existingShopName = await Shop.findOne({ name });
    if (existingShopName) {
      fs.unlinkSync(avatarFile.path); // Clean up uploaded file
      return res.status(400).json({
        success: false,
        msg: "Shop name already used. Choose a different one.",
      });
    }

    const avatarURL = await uploadOnCloudinary(avatarFile.path);
    if (!avatarURL) {
      fs.unlinkSync(avatarFile.path); // Clean up uploaded file
      return res.status(500).json({
        success: false,
        msg: "Failed to upload avatar.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const shopData = {
      name,
      email,
      password: passwordHash,
      phoneNumber: phone,
      pinCode,
      address,
      avatar: avatarURL.secure_url,
    };

    const otp = generateOTP();
    const activationToken = createActivationToken(otp, shopData);

    await sendMail({
      email: shopData.email,
      subject: "Activate your account",
      message: `
        Welcome to E-Commerce! \n
        Hi ${shopData.name}\n
        Thank you for registering with E-Commerce. To activate your Seller account, please use the following One-Time Password (OTP):${otp}\n
        This OTP is valid for 10 minutes. If you did not request this, please ignore this email.\n\n
        Best regards,\n
        The E-Commerce Team\n`,
    });

    return res.status(200).json({
      success: true,
      activationToken,
      msg: `Please check your email (${shopData.email}) to activate your account!`,
    });
  } catch (error) {
    console.log("Error while creating shop", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

const activeShop = async (req, res) => {
  const { activation_otp } = req.body;
  const authHeader = req.headers["authorization"];
  const verificationToken = authHeader && authHeader.split(" ")[1];

  if (!verificationToken) {
    return res.status(400).json({
      success: false,
      msg: "Invalid or missing token.",
    });
  }

  try {
    const tokenVerification = jwt.verify(
      verificationToken,
      process.env.JWT_SECRET
    );
    if (!tokenVerification) {
      return res.status(400).json({
        success: false,
        msg: "Invalid token.",
      });
    }

    const { otp, shopData } = tokenVerification;

    if (!otp === activation_otp) {
      return res.status(400).json({
        success: false,
        msg: "Invalid OTP.",
      });
    }

    const existingShop = await Shop.findOne({ email: shopData.email });
    if (existingShop) {
      return res.status(400).json({
        success: false,
        msg: "Shop already exists with this email.",
      });
    }

    const shop = await Shop.create(shopData);
    const { accessToken, refreshToken } = generateAccessAndRefreshToken(shop);

    if (shop) {
      const _shop = await Shop.findByIdAndUpdate(
        shop._id,
        {
          refreshToken,
        },
        { new: true }
      ).select("-password -refreshToken");

      await sendMail({
        email: shopData.email,
        subject: "Welcome to E-Commerce",
        text: `
      Welcome to E-Commerce!\n
      Hi ${shopData.name},\n
      We're thrilled to welcome you to E-Commerce! Your seller account has been successfully activated, and you're now part of our growing community.\n      
      Seller Name: ${shopData.name}\n
      Email: ${shopData.email}\n      
      If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:support@E-Commerce.com">support@E-Commerce.com</a>.\n
      Thank you for choosing E-Commerce.
      Best regards,\n
      The E-Commerce Team\n`,
      });

      return res
        .status(200)
        .cookie("shopToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json({
          success: true,
          msg: "Congratulations! You have successfully registered 🎉",
          data: _shop,
          accessToken,
          refreshToken,
        });
    }
  } catch (error) {
    console.log("Error in activeShop:", error);
    return res.status(500).json({
      success: false,
      msg: "An error occurred while activating the Shop.",
    });
  }
};

const loginShop = async (req, res) => {
  try {
    const { email, password } = req.body;

    const shop = await Shop.findOne({ email });

    if (!shop) {
      return res.status(404).json({
        success: false,
        msg: "Shop not found",
      });
    }

    const { accessToken, refreshToken } = generateAccessAndRefreshToken(shop);

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        success: true,
        msg: "Congratulations you have successfully logged in",
        accessToken,
        data: shop,
      });
  } catch (error) {
    console.log("Error while logging in shop", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

const getShop = async (req, res) => {
  const shop = await Shop.findById(req.shop._id).select(
    "-password -refreshToken"
  );

  if (!shop) {
    return res.status(404).json({
      success: false,
      msg: "Shop not found",
    });
  }

  return res.status(200).json({
    success: true,
    msg: "Shop details fetched successfully",
    data: shop,
  });
};

const logoutShop = async (req, res) => {
  await Shop.findByIdAndUpdate(
    req.shop._id,
    { refreshToken: undefined },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("shopToken", option)
    .clearCookie("refreshToken", option)
    .json({ success: false, msg: "logged out successfully" });
};

const updateShop = async (req, res) => {
  const { name, description, phoneNumber } = req.body;

  try {
    const shop = await Shop.findById(req.shop._id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        msg: "Shop not found",
      });
    }

    const avatar = req.file;
    let newAvatar;

    if (avatar) {
      newAvatar = await uploadOnCloudinary(avatar.path);
    }

    // Update shop details
    if (newAvatar) shop.avatar = newAvatar.secure_url;
    if (name) shop.name = name;
    if (description) shop.description = description;
    if (phoneNumber) shop.phoneNumber = phoneNumber;

    await shop.save();

    return res.status(200).json({
      success: true,
      msg: "Shop details updated successfully",
      data: shop,
    });
  } catch (error) {
    console.log("Error while updating shop:", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

const getShopInfo = async (req, res) => {
  try {
    const shop = await Shop.findById(req.shop._id).select(
      "-password -refreshToken"
    );

    if (!shop) {
      return res.status(404).json({
        success: false,
        msg: "Shop not found",
      });
    }

    const totalProducts = await Product.countDocuments({ shopId: shop._id });
    const shopRating = 4.5;

    const shopInfo = {
      name: shop.name,
      email: shop.email,
      avatar: shop.avatar,
      phoneNumber: shop.phoneNumber,
      totalProducts,
      shopRating,
      joinedAt: shop.createdAt,
    };

    return res.status(200).json({
      success: true,
      msg: "Shop info fetched successfully",
      data: shopInfo,
    });
  } catch (error) {
    console.log("Error while fetching shop info:", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const shop = await Shop.findOne({ email });

    if (!shop) {
      return res.status(404).json({
        success: false,
        msg: "Shop not found with this email.",
      });
    }

    const otp = generateOTP();
    const resetPasswordToken = createActivationToken(otp, shop);

    await sendMail({
      email: shop.email,
      subject: "Password Reset Request",
      message: `Hello ${shop.username},\n\n your OTP to reset the password for your account is ${otp}.`,
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

    const { shopData } = tokenVerification;

    const { email } = shopData;

    let shop;
    shop = await Shop.find({ email }).select("+password");

    if (!shop) {
      return res.status(400).json({
        success: false,
        msg: "Shop not found",
      });
    }

    shop = shop[0];
    console.log(shop);

    const samePassword = await bcrypt.compare(password, shop.password);

    if (samePassword) {
      return res.status(400).json({
        success: false,
        msg: "New password cannot be the same as the old password.",
      });
    }

    const newPassword = await bcrypt.hash(password, 10);

    shop.password = newPassword;
    await shop.save({ validateBeforeSave: false });

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

export {
  createShop,
  activeShop,
  loginShop,
  getShop,
  logoutShop,
  updateShop,
  getShopInfo,
  forgotPassword,
  resetPassword,
};
