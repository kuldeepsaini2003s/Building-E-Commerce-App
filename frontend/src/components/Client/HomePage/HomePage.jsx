import React from "react";
import BestSelling from "../Product/BestSelling";
import Hero from "./Hero";
import Categories from "./Categories";

const HomePage = () => {
  return (
    <>
      <Hero />
      <Categories />
      <BestSelling />
    </>
  );
};

export default HomePage;
