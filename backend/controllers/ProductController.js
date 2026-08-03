import mongoose from "mongoose";
import Product from "../model/ProductModel.js";
import Shop from "../model/ShopModel.js";
import { uploadOnCloudinary } from "../utils/uploadToCloudinary.js";

const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !originalPrice ||
      !discountPrice ||
      !stock
    ) {
      return res.status(400).json({
        success: false,
        msg: "All fields are required, including images",
      });
    }

    // Check if the shop exists
    const shop = await Shop.findById(req.shop._id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        msg: "Shop not found",
      });
    }

    // Check if images are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "At least one image is required",
      });
    }

    const uploadedImages = [];
    for (const image of req.files) {
      const uploadedImage = await uploadOnCloudinary(image.path);
      if (uploadedImage?.secure_url) {
        uploadedImages.push({
          url: uploadedImage.secure_url,
          public_id: uploadedImage.public_id,
        });
      }
    }

    const newProduct = await Product.create({
      title,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
      shopId: shop._id,
      images: uploadedImages,
    });

    return res.status(200).json({
      success: true,
      msg: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.log("Error while creating product", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

const homePageProducts = async (req, res) => {
  try {
    const { limit = 20, excludeIds = "" } = req.query;
    const excluded = excludeIds.split(",").filter(Boolean);

    const products = await Product.aggregate([
      {
        $match: {
          _id: { $nin: excluded.map((id) => new mongoose.Types.ObjectId(id)) },
        },
      },
      { $sample: { size: parseInt(limit) } },
    ]);

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No products found",
      });
    }

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.log("Error while fetching shuffled products", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

const allProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, excludeIds = "" } = req.query;
    const excluded = excludeIds.split(",").filter(Boolean);
    const parsedLimit = parseInt(limit);
    const skip = (page - 1) * parsedLimit;

    const products = await Product.find({
      _id: { $nin: excluded },
    })
      .skip(skip)
      .limit(parsedLimit)
      .lean(); // slightly faster

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No products found",
      });
    }

    // Shuffle the fetched page
    const shuffledProducts = products.sort(() => Math.random() - 0.5);

    return res.status(200).json({
      success: true,
      data: shuffledProducts,
    });
  } catch (error) {
    console.log("Error while fetching paginated shuffled products", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
      msg: "Product fetched successfully",
    });
  } catch (error) {
    console.log("Error while fetching product by ID", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = req.body;

    const shop = await Shop.findById(req.shop._id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        msg: "Shop not found",
      });
    }

    // Check if the product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "Product not found",
      });
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      data: updatedProduct,
      msg: "Product updated successfully",
    });
  } catch (error) {
    console.log("Error while updating product", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "Product not found",
      });
    }

    // Delete the product
    await Product.findByIdAndDelete(productId);

    return res.status(200).json({
      success: true,
      msg: "Product deleted successfully",
    });
  } catch (error) {
    console.log("Error while deleting product", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

const shopAllProducts = async (req, res) => {
  try {
    const sellerId = req?.shop?._id;

    const products = await Product.find({ shopId: sellerId });

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No products found for this seller",
      });
    }

    return res.status(200).json({
      success: true,
      data: products,
      msg: "Products fetched successfully",
    });
  } catch (error) {
    console.log("Error while fetching seller products", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

const allCategory = async (req, res) => {
  try {
    const products = await Product.find({});

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "No products found",
      });
    }

    const organizedData = {};

    products.forEach((product) => {
      const { category, subCategory, subSubCategory, images } = product;
      const image = images.length > 0 ? images[0].url : null;

      if (!organizedData[category]) {
        organizedData[category] = {};
      }

      if (!subSubCategory) {
        // If subSubCategory is missing, store subCategory directly with image
        if (!organizedData[category][subCategory]) {
          organizedData[category][subCategory] = {
            name: subCategory,
            image: image,
          };
        }
      } else {
        // If subSubCategory exists, nest it under subCategory
        if (!organizedData[category][subCategory]) {
          organizedData[category][subCategory] = {};
        }
        if (!organizedData[category][subCategory][subSubCategory]) {
          organizedData[category][subCategory][subSubCategory] = {
            name: subSubCategory,
            image: image,
          };
        }
      }
    });

    return res.status(200).json({
      success: true,
      msg: "All categories fetched successfully",
      data: organizedData,
    });
  } catch (error) {
    console.log("Error while fetching all categories", error);

    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

const productByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category && category.length) {
      query.category = Array.isArray(category)
        ? { $in: category }
        : { $regex: category, $options: "i" };
    }

    const products = await Product.find(query);

    if (!products.length) {
      return res.status(404).json({
        success: false,
        msg: "No products found",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

const bestSellingProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, excludeIds = "" } = req.query;
    const excluded = excludeIds.split(",").filter(Boolean);

    const products = await Product.find({
      _id: { $nin: excluded },
      isBestSelling: true,
    })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No best selling products found",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Best selling products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.log("Error while fetching best selling products", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

export {
  createProduct,
  shopAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  allCategory,
  productByCategory,
  allProducts,
  bestSellingProducts,
};
