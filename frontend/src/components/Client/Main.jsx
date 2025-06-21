import React from "react";
import Footer from "./HomePage/Footer";
import Header from "./HomePage/Header/Header";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Main;
