import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Login from "./components/Client/Auth/Login";
import SignUp from "./components/Client/Auth/SignUp";
import BestSelling from "./components/Client/Product/BestSelling";
import AllProducts from "./components/Client/Product/AllProducts";
import Cart_Page from "./components/Client/HomePage/Cart";
import Wishlist_Page from "./components/Client/HomePage/Wishlist";
import Main from "./components/Client/Main";
import HomePage from "./components/Client/HomePage/HomePage";
import { useLoading } from "./hooks/LoadingProvider";
import Loader from "./utils/Loader";
import EventCard from "./components/Client/HomePage/EventCard";
import ProductDetailsPage from "./components/Client/Product/ProductDetailsPage";
import OrderConfirmation from "./components/Client/Order/OrderConfirmation";
import { useDispatch } from "react-redux";
import { setCartFromLocalStorage } from "./redux/cartSlice";
import { setWishlistFromLocalStorage } from "./redux/wishlistSlice";
import SingUpShop from "./components/Shop/Auth/Signup";
import LoginShop from "./components/Shop/Auth/Login";
import Dashboard from "./components/Shop/Dashboard";
import FAQPage from "./components/Client/HomePage/FAQPage";
import DashboardHeader from "./components/Shop/DashboardHeader";
import DashboardSideBar from "./components/Shop/DashboardSidebar";
import AllOrders from "./components/Shop/AllOrders";
import ShopAllProducts from "./components/Shop/AllProducts";
import CreateProduct from "./components/Shop/CreateProductPage";
import AllEvents from "./components/Shop/AllEvents";
import CreateEvent from "./components/Shop/CreateEvent";
import WithdrawMoney from "./components/Shop/WithdrawMoney";
import AllCoupons from "./components/Shop/AllCoupons";
import AllRefundOrders from "./components/Shop/AllRefundOrders";
import ShopSettings from "./components/Shop/ShopSettings";
import useFetchUserData from "./hooks/useFetchUserData";
import ForgotPassword from "./components/Auth/ForgotPassword";
import { BACKEND_SHOP, BACKEND_USER } from "./utils/constants";
import Profile from "./components/Client/Profile";

const App = () => {
  useFetchUserData();
  const { isLoading } = useLoading();
  const dispatch = useDispatch();
  const cartData = localStorage.getItem("cart");
  const wishlistData = localStorage.getItem("wishlist");

  useEffect(() => {
    dispatch(setCartFromLocalStorage(JSON.parse(cartData) || []));
    dispatch(setWishlistFromLocalStorage(JSON.parse(wishlistData) || []));
  }, [cartData, wishlistData]);

  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : "auto";
  }, [isLoading]);

  const SellerSection = () => {
    return (
      <>
        <DashboardHeader />
        <div className="flex items-start w-full overflow-y-scroll remove-scrollbar h-[calc(100vh-55px)]">
          <div className="h-full">
            <DashboardSideBar active={1} />
          </div>
          <div className="flex-1 h-[calc(100vh-55px)] remove-scrollbar overflow-y-scroll">
            <Outlet />
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {isLoading && <Loader />}
      <BrowserRouter>
        <Routes>
          <Route element={<Main />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/best-selling" element={<BestSelling />} />
            <Route path="/products" element={<AllProducts />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/Events" element={<EventCard />} />
            <Route path="/cart" element={<Cart_Page />} />
            <Route path="/wishlist" element={<Wishlist_Page />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route
            path="/forgot-password"
            element={
              <ForgotPassword
                apiBaseUrl={BACKEND_USER}
                accountLabel="user"
                loginPath="/login"
              />
            }
          />
          <Route
            path="/forget-password"
            element={
              <ForgotPassword
                apiBaseUrl={BACKEND_USER}
                accountLabel="user"
                loginPath="/login"
              />
            }
          />
          <Route path="/create-shop" element={<SingUpShop />} />
          <Route path="/login-shop" element={<LoginShop />} />
          <Route
            path="/forgot-password-shop"
            element={
              <ForgotPassword
                apiBaseUrl={BACKEND_SHOP}
                accountLabel="shop"
                loginPath="/login-shop"
              />
            }
          />
          <Route element={<SellerSection />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard-orders" element={<AllOrders />} />
            <Route path="/dashboard-products" element={<ShopAllProducts />} />
            <Route
              path="/dashboard-create-product"
              element={<CreateProduct />}
            />
            <Route path="/dashboard-events" element={<AllEvents />} />
            <Route path="/dashboard-create-event" element={<CreateEvent />} />
            <Route
              path="/dashboard-withdraw-money"
              element={<WithdrawMoney />}
            />
            <Route path="/dashboard-coupons" element={<AllCoupons />} />
            <Route path="/dashboard-refunds" element={<AllRefundOrders />} />
            <Route path="/settings" element={<ShopSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
