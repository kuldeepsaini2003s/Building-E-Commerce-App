import React from "react";
import useFetch from "../hooks/useFetch";
import ProductCard from "./ProductCard";
import styles from "../utils/styles";
import { Link } from "react-router-dom";

const AllProducts = () => {
  const { data } = useFetch("https://fakestoreapi.com/products");
  return (
    <div
      className={`${styles.section} grid grid-cols-5 max-[1200px]:grid-cols-4 max-[1000px]:grid-cols-3 max-[800px]:grid-cols-2 max-[500px]:grid-cols-1 gap-5 my-10`}
    >
      {data?.map((product) => (
        <Link to={`/product/${product.id}`}>
          <ProductCard key={product?.id} product={product} />
        </Link>
      ))}
    </div>
  );
};

export default AllProducts;
