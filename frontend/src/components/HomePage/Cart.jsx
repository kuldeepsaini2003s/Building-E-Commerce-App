import React, { useEffect, useState } from "react";
import cartImage from "../../assets/Cart_img.png";
// import { useDispatch, useSelector } from "react-redux";
import { IoRemoveCircleOutline } from "react-icons/io5";
import { RiShoppingBag4Line } from "react-icons/ri";
import { toast } from "react-toastify";
// import {
//   removeFromCart,
//   updateCartQuantity,
// } from "../../utils/redux/cartSlice";
import { Link } from "react-router";
import axios from "axios";
import styles from "../../utils/styles";

const Cart_Page = () => {
  const [cartItems, setCartItems] = useState([]);
  //   const { cart: cartItems } = useSelector((state) => state.cart.items);
  //   const dispatch = useDispatch();
  //   console.log(cartItems);

  //   const calculateTotalPrice = () => {
  //     return cartItems.reduce(
  //       (total, item) => total + item.originalPrice * item.qty,
  //       0
  //     );
  //   };

  const incrementCount = (id, qty) => {
    // dispatch(updateCartQuantity({ id, qty: qty + 1 }));
  };

  const decrementCount = (id, qty) => {
    if (qty > 20) {
      //   dispatch(updateCartQuantity({ id, qty: qty - 1 }));
    }
  };

  const removeItem = (id) => {
    toast.success("Item removed from cart successfully!");
    // dispatch(removeFromCart(id));
  };

  const handleBuyClick = async (productId) => {
    // const order = await axios.post(
    //   BASE_URL + "/payment/create",
    //   {
    //     productId: productId,
    //   },
    //   { withCredentials: true }
    // );
    // const { amount, keyId, currency, notes, orderId } = order.data;
    // const options = {
    //   key: keyId,
    //   amount,
    //   currency,
    //   name: "GraniMart",
    //   description: "Shop MArvels",
    //   order_id: orderId,
    //   prefill: {
    //     username: notes.username,
    //     email: notes.emailId,
    //   },
    //   theme: {
    //     color: "#F37254",
    //   },
    // };
    // const rzp = new window.Razorpay(options);
    // rzp.open();
  };

  return (
    <div
      className={`flex max-[1000px]:flex-col-reverse gap-5 ${styles.section}`}
    >
      <div className="w-full h-[27rem] my-5">
        <h1 className="text-3xl">Shopping Cart</h1>
        {cartItems && cartItems.length > 0 ? (
          <div className="space-y-4 mt-5">
            {cartItems.map((item) => (
              <div
                className="flex max-[600px]:flex-col gap-10 max-[600px]:gap-5 justify-between w-full"
                key={item._id}
              >
                <Link to={`/products/${item?._id}`}>
                  <div className="flex gap-5 max-[600px]:flex-col w-full">
                    <img
                      className="w-40 max-[600px]:w-full flex-shrink-0 shadow-md h-40 max-[600px]:h-60 object-cover max-[600px]:object-contain  object-top rounded-md"
                      src={item?.images[0].url}
                      alt=""
                    />
                    <div className="space-y-2 ">
                      <h1 className="text-lg font-medium line-clamp-2">
                        {item?.name}
                      </h1>
                      <h1 className="text-sm line-clamp-3">
                        {item?.description}
                      </h1>
                    </div>
                  </div>
                </Link>
                <div className="space-y-4 max-[600px]:flex justify-between items-center">
                  <div className="space-y-2">
                    <h1 className="font-medium">
                      Price : ${item?.originalPrice * item?.qty}
                    </h1>
                    <div>
                      <button
                        className="bg-gradient-to-r from-teal-400 h-7 to-teal-500 text-white font-bold rounded-l px-4 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                        onClick={() => decrementCount(item?._id, item?.qty)}
                      >
                        -
                      </button>
                      <span className="bg-gray-200 py-1 text-gray-800 font-medium px-4 ">
                        {item?.qty}
                      </span>
                      <button
                        className="bg-gradient-to-r from-teal-400 h-7 to-teal-500 text-white font-bold rounded-r px-4  shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                        onClick={() => incrementCount(item?._id, item?.qty)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item?._id)}
                    className="px-6 py-2 rounded-md font-medium bg-black text-white flex gap-2 items-center justify-center cursor-pointer"
                  >
                    Remove{" "}
                    <IoRemoveCircleOutline
                      size={20}
                      className="stroke-2 text-white"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full flex flex-col justify-center items-center">
            <img src={cartImage} alt="Empty Cart" />
            <p className="text-sm font-medium">Your cart is currently empty.</p>
          </div>
        )}
      </div>
      {cartItems && cartItems.length > 0 && (
        <div className="min-w-fit h-fit border border-gray-300 space-y-5 max-[1000px]:self-end bg-white rounded-md p-2 shadow-xl py-5">
          <h1 className="text-lg font-medium">
            Subtotal ({cartItems && cartItems.length}) Total Price: $
            {calculateTotalPrice()}
          </h1>
          <button
            onClick={() => handleBuyClick(15)}
            className="px-5 w-full py-2 rounded-md font-medium bg-orange-400 flex gap-2 items-center justify-center cursor-pointer"
          >
            <RiShoppingBag4Line size={20} />
            Proceed to Buy{" "}
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart_Page;
