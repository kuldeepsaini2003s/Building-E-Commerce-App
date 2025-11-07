import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { BACKEND_ORDER } from "../../../utils/constants";
import { CreditCard, Wallet, ArrowLeft } from "lucide-react";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state?.user);
  const userToken = localStorage.getItem("accessToken");

  // Get order data from location state or cart
  const { cartItems, productData, fromCart } = location.state || {};
  const { cart: cartItemsFromRedux } = useSelector((state) => state?.cart);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("online");
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);

  // Use cart items from state or redux
  const items = cartItems || cartItemsFromRedux || [];
  const isSingleProduct = productData && !fromCart;

  // Calculate total
  const calculateTotal = () => {
    if (isSingleProduct) {
      return productData.discountPrice * productData.quantity;
    }
    return items.reduce(
      (total, item) => total + item.discountPrice * (item.qty || 1),
      0
    );
  };

  const totalAmount = calculateTotal();

  // Create order
  const handleCreateOrder = async () => {
    if (!user || !userToken) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      let products = [];

      if (isSingleProduct) {
        products = [
          {
            productId: productData._id,
            quantity: productData.quantity || 1,
          },
        ];
      } else {
        products = items.map((item) => ({
          productId: item._id,
          quantity: item.qty || 1,
        }));
      }

      const response = await axios.post(
        `${BACKEND_ORDER}/createOrder`,
        {
          products,
          paymentMethod: selectedPaymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.status === 201) {
        setOrderData(response.data.data);

        if (selectedPaymentMethod === "online" && response.data.data.razorpay) {
          // Open Razorpay for online payment
          handleRazorpayPayment(response.data.data);
        } else if (selectedPaymentMethod === "cod") {
          // COD order - show success
          toast.success("Order placed successfully! You will pay on delivery.");
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          toast.error("Failed to initialize payment");
        }
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error(
        error.response?.data?.msg || "Failed to create order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = (orderData) => {
    const { razorpayOrderId, _id: orderId, razorpay } = orderData;

    if (!razorpay || !razorpayOrderId) {
      toast.error("Failed to initialize payment");
      return;
    }

    const options = {
      key: razorpay.key_id || "rzp_test_5514",
      amount: razorpay.amount,
      currency: razorpay.currency || "INR",
      name: "Shopsy",
      description: "Order Payment",
      order_id: razorpayOrderId,
      handler: async (response) => {
        try {
          const verifyResponse = await axios.post(
            `${BACKEND_ORDER}/verifyPayment`,
            {
              razorpay_order_id: response?.razorpay_order_id,
              razorpay_payment_id: response?.razorpay_payment_id,
              razorpay_signature: response?.razorpay_signature,
              orderId,
            },
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );
          if (verifyResponse.data.success) {
            toast.success(
              "Order placed successfully and your payment is done!"
            );
            setTimeout(() => {
              navigate("/");
            }, 2000);
          } else {
            toast.error("Payment failed");
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          toast.error("Payment failed");
        }
      },
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.phoneNumber || "",
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        ondismiss: function () {
          toast.info("Payment cancelled");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      toast.error(`Payment failed: ${response.error.description}`);
    });
    rzp.open();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Order Confirmation
          </h1>
          <p className="text-gray-600 mt-2">
            Review your order and choose payment method
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-4">
                {isSingleProduct ? (
                  <div className="flex gap-4 border-b pb-4">
                    <img
                      src={productData.images?.[0]?.url}
                      alt={productData.title}
                      className="w-20 h-20 object-contain rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{productData.title}</h3>
                      <p className="text-sm text-gray-600">
                        Quantity: {productData.quantity || 1}
                      </p>
                      <p className="text-lg font-semibold mt-2">
                        $
                        {productData.discountPrice *
                          (productData.quantity || 1)}
                      </p>
                    </div>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item._id} className="flex gap-4 border-b pb-4">
                      <img
                        src={item.images?.[0]?.url}
                        alt={item.title}
                        className="w-20 h-20 object-contain rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.qty || 1}
                        </p>
                        <p className="text-lg font-semibold mt-2">
                          ${item.discountPrice * (item.qty || 1)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

              <div className="space-y-3">
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedPaymentMethod === "online"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={selectedPaymentMethod === "online"}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <CreditCard className="text-blue-600" size={24} />
                  <div className="flex-1">
                    <h3 className="font-semibold">Pay Now (Online Payment)</h3>
                    <p className="text-sm text-gray-600">
                      Pay securely with Razorpay
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedPaymentMethod === "cod"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={selectedPaymentMethod === "cod"}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <Wallet className="text-green-600" size={24} />
                  <div className="flex-1">
                    <h3 className="font-semibold">Cash on Delivery (COD)</h3>
                    <p className="text-sm text-gray-600">
                      Pay when you receive your order
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Total & Checkout */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Total</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${totalAmount}</span>
                </div>
              </div>

              <button
                onClick={handleCreateOrder}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : selectedPaymentMethod === "online"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading
                  ? "Processing..."
                  : selectedPaymentMethod === "online"
                  ? "Pay Now"
                  : "Place Order (COD)"}
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                By placing your order, you agree to our Terms of Service and
                Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
