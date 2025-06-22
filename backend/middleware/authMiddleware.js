import jwt from "jsonwebtoken";
import { User } from "../model/UserModel.js";
import { Shop } from "../model/ShopModel.js";

const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.header("authorization")?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized request",
      });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    let user;
    let shop;

    if (decoded.role === "client") {
      user = await User.findById(decoded.id).select("-password -refreshToken");

      if (!user) {
        return res.status(401).json({
          success: false,
          msg: "Invalid access token",
        });
      }

      req.user = user;
    } else {
      shop = await Shop.findById(decoded.id).select("-password -refreshToken");

      if (!shop) {
        return res.status(401).json({
          success: false,
          msg: "Invalid access token",
        });
      }

      req.shop = shop;
    }
    next();
  } catch (error) {
    console.log("Error while verifying token", error);
    return res.status(401).json({
      success: false,
      msg: "Invalid access token",
    });
  }
};

export { verifyToken };
