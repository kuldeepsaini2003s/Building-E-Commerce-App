import { AiOutlineMessage, AiOutlineShoppingCart } from "react-icons/ai";
import useFetch from "../../../hooks/useFetch";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import { useParams, useSearchParams } from "react-router-dom";
import { addToCart } from "../../../redux/cartSlice";
import { Heart } from "lucide-react";
import styles from "../../../utils/styles";
import { BACKEND_PRODUCT } from "../../../utils/constants";
import MagnifierImage from "./MagnifierImage";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { data: product } = useFetch(`${BACKEND_PRODUCT}/${id}`);
  const { cart: cartItems } = useSelector((state) => state?.cart);
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const [selected, setSelected] = useState(0);

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
                <div className="flex-grow w-full flex items-center justify-center max-h-[400px] min-h-[300px] sm:max-h-[470px] sm:min-h-[250px]">
                  <MagnifierImage
                    src={product?.images[selected].url}
                    alt="product image"
                  />
                </div>
              </div>
              <div className="min-[800px]:w-[50%] w-full ">
                <h1 className={`${styles.productTitle}`}>{product.title}</h1>
                <pre className="text-wrap font-sans line-clamp-5">
                  {product.description}
                </pre>
                <div className="flex pt-3 items-center gap-10">
                  <div className="flex">
                    <h4 className={`${styles.productDiscountPrice}`}>
                      {product.originalPrice}$
                    </h4>
                    <h3 className={`${styles.price}`}>
                      {product.discountPrice
                        ? product.discountPrice + "$"
                        : null}
                    </h3>
                  </div>
                  <Heart />
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
                  {/* <div>
          {click ? (
            <AiFillHeart
              size={30}
              className="cursor-pointer"
              onClick={() => removeFromWishlistHandler(product)}
              color={click ? "red" : "#333"}
              title="Remove from wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={30}
              className="cursor-pointer"
              onClick={() => addToWishlistHandler(product)}
              color={click ? "red" : "#333"}
              title="Add to wishlist"
            />
          )}
        </div> */}
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

                <div className="flex items-center">
                  {/* <Link href={`/shop/preview/${product?.shop._id}`}>
                    <Image
                      src={`${product?.shop?.avatar?.url}`}
                      alt=""
                      className="w-[50px] h-[50px] rounded-full mr-2"
                    />
                  </link> */}
                  {/* <div className="pr-8">
                    <Link href={`/shop/preview/${product?.shop._id}`}>
                      <h3 className={`${styles.shop_name} pb-1 pt-1`}>
                        {product.shop.name}
                      </h3>
                    </link>
                    <h5 className="pb-3 text-[15px]">
                      ({averageRating}/5) Ratings
                    </h5>
                  </div> */}
                  <div
                    className={`${styles.button} bg-[#6443d1] !h-10 !rounded`}
                    // onClick={handleMessageSubmit}
                  >
                    <span className="text-white flex items-center gap-2">
                      Send Message <AiOutlineMessage className="text-lg" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <ProductDetailsInfo
            product={product}
            products={products}
            totalReviewsLength={totalReviewsLength}
            averageRating={averageRating}
          /> */}
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsPage;

// const ProductDetailsInfo = ({
//   product,
//   products,
//   totalReviewsLength,
//   averageRating,
// }) => {
//   const [active, setActive] = useState(1);

//   return (
//     <div className="bg-[#f5f6fb] px-3 min-[800px]:px-10 py-2 rounded">
//       <div className="w-full flex justify-between border-b pt-10 pb-2">
//         <div className="relative">
//           <h5
//             className={
//               "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer min-[800px]:text-[20px]"
//             }
//             onClick={() => setActive(1)}
//           >
//             Product Details
//           </h5>
//           {active === 1 ? (
//             <div className={`${styles.active_indicator}`} />
//           ) : null}
//         </div>
//         <div className="relative">
//           <h5
//             className={
//               "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer min-[800px]:text-[20px]"
//             }
//             onClick={() => setActive(2)}
//           >
//             Product Reviews
//           </h5>
//           {active === 2 ? (
//             <div className={`${styles.active_indicator}`} />
//           ) : null}
//         </div>
//         <div className="relative">
//           <h5
//             className={
//               "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer min-[800px]:text-[20px]"
//             }
//             onClick={() => setActive(3)}
//           >
//             Seller Information
//           </h5>
//           {active === 3 ? (
//             <div className={`${styles.active_indicator}`} />
//           ) : null}
//         </div>
//       </div>
//       {active === 1 ? (
//         <>
//           <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line">
//             {product.description}
//           </p>
//         </>
//       ) : null}

//       {active === 2 ? (
//         <div className="w-full min-h-[40vh] flex flex-col items-center py-3 overflow-y-scroll">
//           {product &&
//             product.reviews.map((item, index) => (
//               <div className="w-full flex my-2">
//                 <Image
//                   src={`${item.user.avatar?.url}`}
//                   alt=""
//                   className="w-[50px] h-[50px] rounded-full"
//                 />
//                 <div className="pl-2 ">
//                   <div className="w-full flex items-center">
//                     <h1 className="font-[500] mr-3">{item.user.name}</h1>
//                     <Ratings rating={product?.ratings} />
//                   </div>
//                   <p>{item.comment}</p>
//                 </div>
//               </div>
//             ))}

//           <div className="w-full flex justify-center">
//             {product && product.reviews.length === 0 && (
//               <h5>No Reviews have for this product!</h5>
//             )}
//           </div>
//         </div>
//       ) : null}

//       {active === 3 && (
//         <div className="w-full block min-[800px]:flex p-5">
//           <div className="w-full min-[800px]:w-[50%]">
//             <Link href={`/shop/preview/${product.shop._id}`}>
//               <div className="flex items-center">
//                 <Image
//                   src={`${product?.shop?.avatar?.url}`}
//                   className="w-[50px] h-[50px] rounded-full"
//                   alt=""
//                 />
//                 <div className="pl-3">
//                   <h3 className={`${styles.shop_name}`}>{product.shop.name}</h3>
//                   <h5 className="pb-2 text-[15px]">
//                     ({averageRating}/5) Ratings
//                   </h5>
//                 </div>
//               </div>
//             </link>
//             <p className="pt-2">{product.shop.description}</p>
//           </div>
//           <div className="w-full min-[800px]:w-[50%] mt-5 min-[800px]:mt-0 min-[800px]:flex flex-col items-end">
//             <div className="text-left">
//               <h5 className="font-[600]">
//                 Joined on:{" "}
//                 <span className="font-[500]">
//                   {product.shop?.createdAt?.slice(0, 10)}
//                 </span>
//               </h5>
//               <h5 className="font-[600] pt-3">
//                 Total Products:{" "}
//                 <span className="font-[500]">
//                   {products && products.length}
//                 </span>
//               </h5>
//               <h5 className="font-[600] pt-3">
//                 Total Reviews:{" "}
//                 <span className="font-[500]">{totalReviewsLength}</span>
//               </h5>
//               <Link href="/">
//                 <div
//                   className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}
//                 >
//                   <h4 className="text-white">Visit Shop</h4>
//                 </div>
//               </link>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
