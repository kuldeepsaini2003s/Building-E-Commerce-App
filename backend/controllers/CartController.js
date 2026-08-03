import Cart from "../model/CartModel.js";
import Product from "../model/ProductModel.js";
import User from "../model/UserModel.js";

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        msg: "Product ID are required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "User not found",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(400).json({
        success: false,
        msg: "Product not found",
      });
    }

    const productExist = await Cart.findOne({
      owner: user._id,
      product: product._id,
    });

    if (productExist) {
      return res.status(400).json({
        success: false,
        msg: "Product already added to cart",
      });
    }

    await Cart.create({ owner, product, quantity });

    return res.status(200).json({
      success: true,
      msg: "Product added to cart successfully",
    });
  } catch (error) {
    console.log("Error while adding product to cart:", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        msg: "Product ID is required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "User not found",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "Product not found",
      });
    }

    const deletedItem = await Cart.findOneAndDelete({
      owner: user._id,
      product: product._id,
    });

    if (!deletedItem) {
      return res.status(400).json({
        success: false,
        msg: "Product not found in cart",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Product removed from cart successfully",
    });
  } catch (error) {
    console.log("Error while removing product from cart:", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

const cartItems = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    const cart = await Cart.find({ owner: user._id }).populate("product");

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.log("Error fetching cart items:", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { quantity, productId } = req.body;

    if (!quantity || !productId) {
      return res.status(400).json({
        success: false,
        msg: "All fields are required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "Product not found",
      });
    }

    const cartItem = await Cart.findOne({
      owner: user._id,
      product: product._id,
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        msg: "Product not found in cart",
      });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    return res.status(200).json({
      success: true,
      msg: "Product quantity updated successfully",
      cartItem,
    });
  } catch (error) {
    console.log("Error while updating product quantity:", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

export { addToCart, removeFromCart, cartItems, updateQuantity };
