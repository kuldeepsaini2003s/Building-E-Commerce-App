import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../../redux/cartSlice";
import { Link } from "react-router-dom";
import { CgDetailsMore } from "react-icons/cg";
import { IoCartOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import styles from "../../../utils/styles";

const EventCard = () => {
  const [currentEvent, setCurrentEvent] = useState(null);
  const { products } = useSelector((state) => state.product);
  console.log(products[5]);

  useEffect(() => {
    if (products) {
      setCurrentEvent(products[5]);
    }
  }, [products]);

  return (
    <div
      className={`block rounded-lg  lg:flex gap-5 p-2 mt-2 ${styles.section}`}
    >
      <div className="w-[50%] m-auto">
        <img
          src={`${currentEvent && currentEvent?.thumbnail}`}
          className="w-full object-contain rounded-md max-h-[300px] min-h-[200px] sm:max-h-[300px] sm:min-h-[250px]"
          alt="product image"
        />
      </div>
      <div className="w-full lg:[w-50%] flex flex-col justify-start">
        <h2 className={`${styles.productTitle}`}>
          {currentEvent && currentEvent?.title}
        </h2>
        <p>{currentEvent && currentEvent?.description}</p>
        <div className="flex py-2 justify-between">
          <div className="flex">
            <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
              {currentEvent && currentEvent?.price}$
            </h5>
            <h5 className="font-bold text-[20px] text-[#333] font-Roboto">
              {currentEvent && currentEvent?.price}$
            </h5>
          </div>
          <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
            {currentEvent && currentEvent?.sold_out} sold
          </span>
        </div>
        {/* <CountDown product={product} /> */}
        <div className="flex items-center text-[#fff]  gap-5">
          <Link
            to={`/product/${currentEvent && currentEvent?._id}?isEvent=true`}
          >
            <div className={`${styles.button} flex items-center gap-2 !h-10`}>
              See Details <CgDetailsMore size={20} />
            </div>
          </Link>
          <AddToCartButton product={currentEvent} />
        </div>
      </div>
    </div>
  );
};

export default EventCard;

const AddToCartButton = ({ product }) => {
  const { cart: cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    const item = cartItems.find((i) => i?._id === product?._id);
    if (item) {
      toast.error("Item already exist in cart");
    } else {
      toast.success("Item added to cart successfully");
      dispatch(addToCart({ ...product, qty: 1 }));
    }
  };

  return (
    <div
      className={`${styles.button} flex items-center gap-2 !h-10`}
      onClick={addToCartHandler}
    >
      Add to cart <IoCartOutline size={20} />
    </div>
  );
};
