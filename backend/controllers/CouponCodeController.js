import { CouponCode } from "../model/CouponCodeModel.js";
import { Product } from "../model/ProductModel.js";
import { Shop } from "../model/ShopModel.js";

export const createCouponCode = async (req, res, next) => {
  try {
    const { name, discount, minAmount, maxAmount, productId } = req.body;

    const shop = await Shop.findById(req.shop._id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        msg: "Shop not found",
      });
    }

    const isCouponCodeExists = await CouponCode.findOne({ name });

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "Product not found",
      });
    }

    if (isCouponCodeExists) {
      return res
        .status(400)
        .json({ success: false, msg: "Coupon code already exists!" });
    }

    const couponCode = await CouponCode.create({
      name,
      discount,
      minAmount,
      maxAmount,
      shopId: shop._id,
      productId: product._id,
    });

    return res.status(200).json({
      success: true,
      msg: "Coupon code created successfully",
      data: couponCode,
    });
  } catch (error) {
    console.log("Error wile creating coupon code", error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong",
    });
  }
};

// Get all coupon codes of a shop
export const getShopCouponCodes = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.shop._id);

    if (!shop) {
      return res.status({
        success: false,
        msg: "seller not found",
      });
    }

    const shopId = shop._id;

    const couponCodes = await CouponCode.find({ shopId });

    return res.status(200).json({
      success: true,
      msg: "Coupon code fetched successfully",
      data: couponCodes,
    });
  } catch (error) {
    console.log("Error wile getting Shop Coupon Code", error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong",
    });
  }
};

export const getCouponCodeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const couponCode = await CouponCode.findById(id);

    if (!couponCode) {
      return res.status(400).json({
        success: false,
        msg: "Coupon code not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: couponCode,
    });
  } catch (error) {
    console.log("Error wile getting coupon code by id", error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong",
    });
  }
};

export const updateCouponCode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, value, minAmount, maxAmount, selectedProduct } = req.body;

    const couponCode = await CouponCode.findByIdAndUpdate(
      id,
      {
        name,
        value,
        minAmount,
        maxAmount,
        selectedProduct,
      },
      { new: true, runValidators: true }
    );

    if (!couponCode) {
      return res.status(400).json({
        success: false,
        msg: "Coupon code not found",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Coupon code updated successfully",
      data: couponCode,
    });
  } catch (error) {
    console.log("Error wile updating coupon code", error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong",
    });
  }
};

export const deleteCouponCode = async (req, res, next) => {
  try {
    const { id } = req.params;

    const couponCode = await CouponCode.findByIdAndDelete(id);

    if (!couponCode) {
      return res.status(400).json({
        success: false,
        msg: "Coupon code not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon code deleted successfully!",
    });
  } catch (error) {
    console.log("Error wile deleting coupon code", error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong",
    });
  }
};
