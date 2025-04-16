import { Eye, Heart, ShoppingCart } from "lucide-react";
import React from "react";
import { AiOutlineStar } from "react-icons/ai";

const ProductCard = ({ product }) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Product Image Container */}
      <div className="relative rounded-lg p-4 mb-2">
        <img
          src={product?.image}
          alt="Product image"
          className="w-full h-40 object-contain mx-auto"
        />

        {/* Action Buttons */}
        <div className="absolute right-4 top-2 flex flex-col gap-2">
          <button className="p-1 rounded-full hover:bg-gray-100">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-1 rounded-full hover:bg-gray-100">
            <Eye className="w-5 h-5" />
          </button>
          <button className="p-1 rounded-full hover:bg-gray-100">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="px-4 pb-4 flex flex-col gap-2 justify-center">
        {/* Seller Name */}
        <a href="#" className="text-blue-500 text-sm">
          Chandan kumal
        </a>

        {/* Product Title */}
        <h3 className="font-medium line-clamp-2 text-gray-800 leading-tight">
          {product?.title}
        </h3>

        {/* Rating Stars */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <AiOutlineStar
              size={20}
              color="#f6ba00"
              className="mr-2 cursor-pointer"
            />
          ))}
        </div>

        {/* Price Information */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold">{product?.price}$</span>
          <span className="text-sm text-red-500 line-through">
            {product?.price}$
          </span>
          <span className="ml-auto text-green-500 text-sm">0 sold</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
