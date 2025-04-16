import React from "react";
import styles from "../../utils/styles";
// import CountDown from "./CountDown";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useFetch from "../../hooks/useFetch";

const EventCard = ({ active }) => {
  const { data } = useFetch("https://fakestoreapi.com/products");
  // const addToCartHandler = (data) => {
  //   const isItemExists = cart && cart.find((i) => i._id === data._id);
  //   if (isItemExists) {
  //     toast.error("Item already in cart!");
  //   } else {
  //     if (data.stock < 1) {
  //       toast.error("Product stock limited!");
  //     } else {
  //       const cartData = { ...data, qty: 1 };
  //       dispatch(addTocart(cartData));
  //       toast.success("Item added to cart successfully!");
  //     }
  //   }
  // }

  return (
    <div
      className={`w-full block bg-white rounded-lg ${
        active ? "unset" : "mb-12"
      } lg:flex gap-5 p-2`}
    >
      <div className="w-[50%] m-auto">
        <img src={`${data && data[9]?.image}`} alt="" />
      </div>
      <div className="w-full lg:[w-50%] flex flex-col justify-center">
        <h2 className={`${styles.productTitle}`}>{data && data[9]?.name}</h2>
        <p>{data && data[9]?.description}</p>
        <div className="flex py-2 justify-between">
          <div className="flex">
            <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
              {data && data[9]?.originalPrice}$
            </h5>
            <h5 className="font-bold text-[20px] text-[#333] font-Roboto">
              {data && data[9]?.discountPrice}$
            </h5>
          </div>
          <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
            {data && data[9]?.sold_out} sold
          </span>
        </div>
        {/* <CountDown data={data} /> */}
        <br />
        <div className="flex items-center">
          <Link to={`/product/${data && data[9]?._id}?isEvent=true`}>
            <div className={`${styles.button} text-[#fff]`}>See Details</div>
          </Link>
          <div
            className={`${styles.button} text-[#fff] ml-5`}
            onClick={() => addToCartHandler(data)}
          >
            Add to cart
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
