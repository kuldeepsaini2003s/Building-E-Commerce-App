import React, { useEffect } from "react";
import "./App.css";
import FAQPage from "./components/HomePage/FAQPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import BestSelling from "./components/BestSelling";
import AllProducts from "./components/AllProducts";
import Cart_Page from "./components/HomePage/Cart";
import Wishlist_Page from "./components/HomePage/Wishlist";
import Main from "./components/Main";
import HomePage from "./components/HomePage/HomePage";
import { useLoading } from "./hooks/LoadingProvider";
import Loader from "./utils/Loader";
import EventCard from "./components/HomePage/EventCard";
import ProductDetailsPage from "./components/ProductDetailsPage";

const App = () => {
  const { isLoading } = useLoading();

  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : "auto";
  }, [isLoading]);

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
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
