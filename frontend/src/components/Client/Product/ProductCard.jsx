import { AiOutlineStar } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../../../redux/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { Eye, Heart, ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import { addToWishlist } from "../../../redux/wishlistSlice";
import { useEffect, useState } from "react";

const ProductCard = ({ product }) => {
  const { cart: cartItems } = useSelector((state) => state?.cart);
  const { wishlist: wishlistItems } = useSelector((state) => state?.wishlist);
  const [wishlistItem, setWishlistItem] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const item = wishlistItems.find((i) => i._id === product._id);
    if (item) {
      setWishlistItem(true);
    }
  }, [wishlistItems]);

  const scrollTop = () => {
    window.scrollTo({ behavior: "auto", top: 0 });
  };

  const handleNavigate = () => {
    scrollTop();
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const item = cartItems.find((item) => item._id === product._id);
    if (item) {
      toast.error("Item already in cart!");
    } else {
      toast.success("Item added to cart successfully!");
      dispatch(addToCart({ ...product, qty: 1 }));
    }
  };

  const handleAddWishlist = (e) => {
    e.stopPropagation();
    const item = wishlistItems.find((item) => item._id === product._id);
    if (item) {
      toast.error("Item already added to wishlist!");
    } else {
      toast.success("Item added to wishlist successfully!");
      dispatch(addToWishlist(product));
    }
  };

  return (
    <div
      onClick={handleNavigate}
      className="w-full bg-white cursor-pointer rounded-lg shadow-xl overflow-hidden"
    >
      {/* Product Image Container */}
      <div className="relative rounded-lg p-4 mb-2">
        <Link to={`/product/${product._id}`}>
          <img
            src={product?.images[0]?.url || ""}
            alt="Product image"
            className="w-full h-40 object-contain mx-auto"
          />
        </Link>
        {/* Action Buttons */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-10 right-4 top-2 flex flex-col gap-2"
        >
          <button
            onClick={handleAddWishlist}
            className="p-1 cursor-pointer rounded-full hover:bg-gray-100"
          >
            <Heart
              className={`w-5 h-5 ${
                wishlistItem ? "fill-[#ff0000] stroke-[#ff0000]" : ""
              }`}
            />
          </button>
          <button className="p-1 cursor-pointer rounded-full hover:bg-gray-100">
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={handleAddToCart}
            className="p-1 cursor-pointer rounded-full hover:bg-gray-100"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="px-4 pb-4 flex flex-col gap-2 justify-center">
        {/* Seller Name */}
        <h1 className="text-blue-500 text-sm">Kuldeep Saini</h1>
        {/* Product Title */}
        <Link className="space-y-2" to={`/product/${product._id}`}>
          <h3 className="font-medium line-clamp-2 text-gray-800 leading-tight">
            {product?.title}
          </h3>
          {/* Rating Stars */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <AiOutlineStar
                key={index}
                size={20}
                color="#f6ba00"
                className="mr-2 cursor-pointer"
              />
            ))}
          </div>
        </Link>
        {/* Price Information */}
        <Link to={`/product/${product._id}`}>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">{product?.discountPrice}$</span>
            <span className="text-sm text-red-500 line-through">
              {product?.originalPrice}$
            </span>
            <span className="ml-auto text-green-500 text-sm">0 sold</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
