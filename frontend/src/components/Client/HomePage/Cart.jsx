import { useDispatch, useSelector } from "react-redux";
import cartImg from "/Cart_img.png";
import { Link } from "react-router-dom";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { RiShoppingBag4Line } from "react-icons/ri";
import styles from "../../../utils/styles";
import { removeFromCart, updateCartQuantity } from "../../../redux/cartSlice";
import { toast } from "react-toastify";

const CartPage = () => {
  const { cart: cartItems } = useSelector((state) => state?.cart);

  return (
    <div
      className={`relative flex max-[500px]:flex-col my-5 gap-5 ${styles.section}`}
    >
      <div className="w-full">
        <h1 className="lg:text-3xl font-semibold text-xl">Shopping Cart</h1>
        {cartItems && cartItems?.length > 0 ? (
          <div className="grid max-[500px]:grid-cols-1 grid-cols-2 gap-5 mt-5">
            {cartItems?.map((item) => (
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
                    src={item?.images[0]?.url}
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
            ))}
          </div>
        ) : (
          <div className="w-full flex flex-col justify-center items-center max-sm:mt-10 max-sm:gap-5">
            <img src={cartImg} className="w-48" alt="Empty Cart" />
            <p className="text-sm font-medium">Your cart is currently empty.</p>
          </div>
        )}
      </div>
      {cartItems && cartItems.length > 0 && (
        <BuyProduct cartItems={cartItems} />
      )}
    </div>
  );
};

export default CartPage;

const UpdateQuantityButton = ({ item }) => {
  const dispatch = useDispatch();

  const removeItem = (id) => {
    toast.success("Item removed from cart successfully!");
    dispatch(removeFromCart(id));
  };

  const incrementCount = (id, qty) => {
    dispatch(updateCartQuantity({ id, qty: qty + 1 }));
  };

  const decrementCount = (id, qty) => {
    if (qty > 1) {
      dispatch(updateCartQuantity({ id, qty: qty - 1 }));
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="min-[1100px]:space-y-4 text-sm max-[1100px]:flex justify-between"
    >
      <div className="space-y-2">
        <h1 className="font-semibold">
          Price : ${item?.discountPrice * item?.qty}
        </h1>
        <div>
          <button
            className="bg-gradient-to-r from-teal-400 h-7 to-teal-500 text-white font-bold rounded-l px-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
            onClick={() => decrementCount(item?._id, item?.qty)}
          >
            -
          </button>
          <span className="bg-gray-200 py-1 text-gray-800 font-medium px-2">
            {item?.qty}
          </span>
          <button
            className="bg-gradient-to-r from-teal-400 h-7 to-teal-500 text-white font-bold rounded-r px-2  shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
            onClick={() => incrementCount(item?._id, item?.qty)}
          >
            +
          </button>
        </div>
      </div>
      <button
        onClick={() => removeItem(item?._id)}
        className="text-xs px-4 py-2 h-fit rounded-md font-medium bg-black text-white flex gap-2 items-center justify-center cursor-pointer"
      >
        Remove{" "}
        <IoMdRemoveCircleOutline size={20} className="stroke-2 text-white" />
      </button>
    </div>
  );
};

const BuyProduct = ({ cartItems }) => {
  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.discountPrice * item.qty,
      0
    );
  };

  // const handleBuyClick = async (productId) => {
  //   const order = await axios.post(
  //     BASE_URL + "/payment/create",
  //     {
  //       productId: productId,
  //     },
  //     { withCredentials: true }
  //   );
  //   const { amount, keyId, currency, notes, orderId } = order.data;
  //   const options = {
  //     key: keyId,
  //     amount,
  //     currency,
  //     name: "GraniMart",
  //     description: "Shop MArvels",
  //     order_id: orderId,
  //     prefill: {
  //       username: notes.username,
  //       email: notes.emailId,
  //     },
  //     theme: {
  //       color: "#F37254",
  //     },
  //   };
  //   const rzp = new window.Razorpay(options);
  //   rzp.open();
  // };

  return (
    <div className="min-w-fit h-fit border max-[750px]:hidden max-[750px]:fixed top-5 right-5 max-[750px]:bg-white max-[750px]:w-28 min-[750px]:inset-0 border-gray-300 space-y-5 max-[500px]:self-end  rounded-md p-2 shadow-xl py-5">
      <h1 className="text-lg font-medium">
        Subtotal ({cartItems && cartItems.length}) <br /> Total Price: $
        {calculateTotalPrice()}
      </h1>
      <button
        // onClick={() => handleBuyClick(15)}
        className="px-5 w-full py-2 rounded-md font-medium bg-orange-400 flex gap-2 items-center justify-center cursor-pointer"
      >
        <RiShoppingBag4Line size={20} />
        Proceed to Buy{" "}
      </button>
    </div>
  );
};
