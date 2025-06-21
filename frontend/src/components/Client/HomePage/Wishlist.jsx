import { useDispatch, useSelector } from "react-redux";
import wishlist_Empty_Img from "/empty-wishlist.png";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineStar } from "react-icons/ai";
import { Heart, ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/wishlistSlice";
import styles from "../../../utils/styles";

const WishlistPage = () => {
  const { wishlist: wishlistItems } = useSelector((state) => state?.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const scrollTop = () => {
    window.scrollTo({ behavior: "auto", top: 0 });
  };

  const handleNavigate = () => {
    scrollTop();
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = (product) => {
    const item = wishlistItems.find((item) => item._id === product._id);
    if (item) {
      toast.error("Item already in cart!");
    } else {
      toast.success("Item added to cart successfully!");
      dispatch(addToWishlist(product));
    }
  };

  const handleRemove = (id) => {
    toast.success("Item remove from wishlist successfully");
    dispatch(removeFromWishlist(id));
  };

  return (
    <div className={`relative my-5 gap-5 ${styles.section}`}>
      <div className="w-full">
        {wishlistItems && wishlistItems?.length > 0 ? (
          <>
            <h1 className="lg:text-3xl font-semibold text-xl">Wishlist</h1>
            <div className="grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-2 mt-5">
              {wishlistItems?.map((item) => (
                <div
                  key={item._id}
                  onClick={handleNavigate}
                  className="w-full bg-white cursor-pointer rounded-lg shadow-xl overflow-hidden"
                >
                  {/* Product Image Container */}
                  <div className="relative rounded-lg p-4 mb-2">
                    <Link to={`/product/${item._id}`}>
                      <img
                        src={item?.thumbnail || ""}
                        alt="Product image"
                        className="w-full h-40 object-contain mx-auto"
                      />
                    </Link>
                    {/* Action Buttons */}
                    <div className="absolute z-10 right-4 top-2 flex flex-col gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(item._id);
                        }}
                        className="p-1 cursor-pointer rounded-full hover:bg-gray-100"
                      >
                        <Heart className="w-5 h-5 fill-[#ff0000] stroke-[#ff0000]" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item);
                        }}
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
                    <Link className="space-y-2" to={`/product/${item._id}`}>
                      <h3 className="font-medium line-clamp-2 text-gray-800 leading-tight">
                        {item?.title}
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
                    <Link to={`/product/${item._id}`}>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold">
                          {item?.price}$
                        </span>
                        <span className="text-sm text-red-500 line-through">
                          {item?.price}$
                        </span>
                        <span className="ml-auto text-green-500 text-sm">
                          0 sold
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
              {/* {wishlistItems?.map((item) => (
              <div
                key={item._id}
                className="flex border w-full border-gray-200 max-[1100px]:flex-col rounded-md shadow-sm p-2 gap-3 justify-between w-full"
              >
                <Link
                  className="flex gap-2 max-[1100px]:flex-col"
                  to={`/product/${item?._id}`}
                >
                  <img
                    className="w-28 h-40 max-[1100px]:w-full flex-shrink-0 min-[1100px]:h-28 max-[600px]:h-60 object-contain max-[600px]:object-contain object-top rounded-md"
                    src={item?.thumbnail}
                    alt="Product Image"
                  />
                  <div className="space-y-2 w-full">
                    <h1 className="font-semibold leading-5 line-clamp-2">
                      {item?.title}
                    </h1>
                    <h1 className="text-sm line-clamp-3">
                      {item?.description}
                    </h1>
                  </div>
                </Link>
                <UpdateQuantityButton item={item} />
              </div>
            ))} */}
            </div>
          </>
        ) : (
          <div className="flex flex-col h-[26rem] justify-center items-center gap-2">
            <img className="w-72" src={wishlist_Empty_Img} alt="" />
            <h1 className="font-semibold">Your wishList is currently empty.</h1>
            <Link to={"/"}>
              <button className="font-light cursor-pointer">
                RETURN TO Shop
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
