import { AiOutlineShoppingCart } from "react-icons/ai";
import useFetch from "../../../hooks/useFetch";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { addToCart } from "../../../redux/cartSlice";
import { Heart } from "lucide-react";
import styles from "../../../utils/styles";
import { BACKEND_PRODUCT } from "../../../utils/constants";
import magnifierImage from "./magnifierImage";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { data: product } = useFetch(`${BACKEND_PRODUCT}/${id}`);
  const { cart: cartItems } = useSelector((state) => state?.cart);
  const { wishlist } = useSelector((state) => state?.wishlist);
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const [selected, setSelected] = useState(0);
  const [isWishlistItem, setIsWishlistItem] = useState(false);
  const [zoomCoords, setZoomCoords] = useState(null);
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    if (wishlist) {
      const item = wishlist.find((i) => i?._id === product?._id);
      if (item) {
        setIsWishlistItem(true);
      } else {
        setIsWishlistItem(false);
      }
    }
  });

  const incrementCount = () => {
    setCount((prev) => prev + 1);
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount((prev) => prev - 1);
    }
  };
  const addProductToCart = () => {
    const item = cartItems?.find((item) => item?._id === product?._id);
    if (item) {
      toast.error("Item already in cart!");
    } else {
      toast.success("Item added to cart successfully!");
      dispatch(addToCart({ ...product, qty: count }));
    }
  };

  const bulletPoints = product?.description
    .split("\r\n")
    .filter((line) => line.trim() !== "")
    .map((line) => `• ${line.trim()}`)
    .join("\n");

  return (
    <div className="bg-white">
      {product ? (
        <div className={`${styles.section}`}>
          <div className="w-full py-5">
            <div className="block w-full gap-5 min-[650px]:flex">
              <div className="flex gap-2 w-full min-[800px]:w-[50%]">
                <div className="w-14 flex-shrink-0 flex flex-col gap-2">
                  {product &&
                    product.images.map((i, index) => (
                      <div
                        key={index}
                        className={`${
                          selected === index ? "border" : "null"
                        } cursor-pointer rounded-md p-1`}
                      >
                        <img
                          src={`${i.url}`}
                          alt="product image"
                          className="overflow-hidden rounded-md"
                          onClick={() => setSelected(index)}
                        />
                      </div>
                    ))}
                </div>
                <div className="relative flex-grow w-full flex items-center justify-center max-h-[400px] min-h-[300px] sm:max-h-[470px] sm:min-h-[250px]">
                  <div className="relative w-full h-full">
                    <magnifierImage
                      src={product.images[selected].url}
                      alt="product image"
                      onZoom={(data) => {
                        setIsZooming(true);
                        setZoomCoords(data);
                      }}
                      onZoomEnd={() => setIsZooming(false)}
                    />
                    {isZooming && zoomCoords && (
                      <div
                        className="absolute border border-blue-400 border-dotted pointer-events-none"
                        style={{
                          width: 120,
                          height: 120,
                          left: zoomCoords.lensX,
                          top: zoomCoords.lensY,
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="relative min-[800px]:w-[50%] w-full ">
                {isZooming && zoomCoords && (
                  <div
                    className="absolute top-0 left-0 w-full max-h-[400px] min-h-[300px] sm:max-h-[470px] sm:min-h-[470px] border overflow-hidden rounded shadow-xl z-50"
                    style={{
                      backgroundImage: `url(${product?.images[selected].url})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: `${zoomCoords.bgWidth}px ${zoomCoords.bgHeight}px`,
                      backgroundPosition: `${zoomCoords.bgX}px ${zoomCoords.bgY}px`,
                    }}
                  />
                )}

                <h1 className={`${styles.productTitle}`}>{product.title}</h1>
                <div className="flex pt-5 items-center gap-10">
                  <div className="flex">
                    <h4 className={`${styles.productDiscountPrice}`}>
                      {product.discountPrice}$
                    </h4>
                    <h3 className={`${styles.price}`}>
                      {product.originalPrice
                        ? product.originalPrice + "$"
                        : null}
                    </h3>
                  </div>
                  {isWishlistItem ? (
                    <Heart
                      size={22}
                      className="cursor-pointer"
                      onClick={() => removeFromWishlistHandler(product)}
                      color={isWishlistItem ? "red" : "#333"}
                      title="Remove from wishlist"
                    />
                  ) : (
                    <Heart
                      size={22}
                      className="cursor-pointer"
                      onClick={() => addToWishlistHandler(product)}
                      color={isWishlistItem ? "red" : "#333"}
                      title="Add to wishlist"
                    />
                  )}
                  <div>
                    <h5 className="text-[15px]">
                      {product.stock > 0 ? (
                        <span className="text-green-500">In Stock</span>
                      ) : (
                        <span className="text-red-500">Out of Stock</span>
                      )}
                    </h5>
                  </div>
                </div>

                <div className="flex items-center gap-10">
                  <div className="flex items-center">
                    <button
                      className="bg-gradient-to-r p-1 from-teal-400 px-4 py-2 cursor-pointer to-teal-500 text-white font-bold rounded-l shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <input
                      value={count || (count === 0 && 1)}
                      type="number"
                      onChange={(e) => setCount(Number(e.target.value))}
                      className="no-spinner bg-gray-200 text-gray-800 font-medium w-10 p-1 text-center py-2 outline-none"
                    />
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 px-4 cursor-pointer py-2 text-white font-bold rounded-r shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>
                  <div></div>
                  <div
                    className={`${styles.button} max-sm:w-full !h-10 !rounded flex items-center`}
                    onClick={addProductToCart}
                  >
                    <span className="text-white flex items-center gap-2">
                      Add to cart{" "}
                      <AiOutlineShoppingCart className="max-sm:text-2xl" />
                    </span>
                  </div>
                </div>
                <div>
                  <h5 className="text-xl font-semibold pb-2 pt-3">
                    About Item
                  </h5>
                  <pre className="text-wrap text-sm font-sans">
                    {bulletPoints}
                  </pre>
                </div>
              </div>
            </div>
          </div>
          <ProductDetailsInfo
            product={product}
            // products={products}
            // totalReviewsLength={totalReviewsLength}
            // averageRating={averageRating}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsPage;

const ProductDetailsInfo = ({
  product,
  products,
  totalReviewsLength,
  averageRating,
}) => {
  const [active, setActive] = useState(1);
  const bulletPoints = product?.description
    .split("\r\n")
    .filter((line) => line.trim() !== "")
    .map((line) => `• ${line.trim()}`)
    .join("\n");

  return (
    <div className="bg-gray-200 px-3 min-[800px]:px-5 py-5 my-5 rounded-md">
      <div className="w-full flex justify-between pb-2">
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer min-[800px]:text-[20px]"
            }
            onClick={() => setActive(1)}
          >
            Product Details
          </h5>
          {active === 1 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer min-[800px]:text-[20px]"
            }
            onClick={() => setActive(2)}
          >
            Product Reviews
          </h5>
          {active === 2 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer min-[800px]:text-[20px]"
            }
            onClick={() => setActive(3)}
          >
            Seller Information
          </h5>
          {active === 3 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
      </div>
      {active === 1 ? (
        <>
          <pre className="py-2 text-[18px] leading-8 font-sans pb-10 whitespace-pre-line">
            {bulletPoints}
          </pre>
        </>
      ) : null}

      {active === 2 ? (
        <div className="w-full min-h-[40vh] flex flex-col items-center py-3 overflow-y-scroll">
          {product &&
            product.reviews.map((item, index) => (
              <div className="w-full flex my-2">
                <img
                  src={`${item.user.avatar?.url}`}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full"
                />
                <div className="pl-2 ">
                  <div className="w-full flex items-center">
                    <h1 className="font-[500] mr-3">{item.user.name}</h1>
                    <Ratings rating={item?.ratings} />
                  </div>
                  <p>{item.comment}</p>
                </div>
              </div>
            ))}

          <div className="w-full flex justify-center">
            {product && product.reviews.length === 0 && (
              <h5>No Reviews have for this product!</h5>
            )}
          </div>
        </div>
      ) : null}

      {active === 3 && (
        <div className="w-full block min-[800px]:flex p-5">
          <div className="w-full min-[800px]:w-[50%]">
            <Link href={`/shop/preview/${product.shop._id}`}>
              <div className="flex items-center">
                <img
                  src={`${product?.shop?.avatar?.url}`}
                  className="w-[50px] h-[50px] rounded-full"
                  alt=""
                />
                <div className="pl-3">
                  <h3 className={`${styles.shop_name}`}>{product.shop.name}</h3>
                  <h5 className="pb-2 text-[15px]">
                    ({averageRating}/5) Ratings
                  </h5>
                </div>
              </div>
            </Link>
            <p className="pt-2">{product.shop.description}</p>
          </div>
          <div className="w-full min-[800px]:w-[50%] mt-5 min-[800px]:mt-0 min-[800px]:flex flex-col items-end">
            <div className="text-left">
              <h5 className="font-[600]">
                Joined on:{" "}
                <span className="font-[500]">
                  {product.shop?.createdAt?.slice(0, 10)}
                </span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Products:{" "}
                <span className="font-[500]">
                  {products && products.length}
                </span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Reviews:{" "}
                <span className="font-[500]">{totalReviewsLength}</span>
              </h5>
              <Link href="/">
                <div
                  className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}
                >
                  <h4 className="text-white">Visit Shop</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
