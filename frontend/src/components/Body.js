import React from "react";
import Navbar from "./Navbar";
import Carousel from "./Carousel";
import { Outlet } from "react-router";
import Footer from "./Footer";
import Cart from "./Cart";

const Body = () => {
  return (
    <div>
      <Navbar />
      <Outlet/>      
      <Footer/>
    </div>
  );
};

export default Body;
