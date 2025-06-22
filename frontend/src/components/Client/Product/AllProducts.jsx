import { useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import styles from "../../../utils/styles";
import { useSearchParams } from "react-router-dom";
import { BACKEND_PRODUCT } from "../../../utils/constants";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLoading } from "../../../hooks/LoadingProvider";

const AllProducts = () => {
  const { products } = useSelector((state) => state.product);
  const [searchParams] = useSearchParams();
  const category = searchParams?.get("category");
  const [categoryData, setCategoryData] = useState([]);
  const { setIsLoading } = useLoading();

  const fetchCategoryData = async () => {
    setIsLoading(true);
    try {
      const { status, data } = await axios.get(
        `${BACKEND_PRODUCT}/product?category=${category}`
      );
      if (status === 200) {
        setCategoryData(data?.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error while fetching data by category", error);
      setIsLoading(false);
      setCategoryData([]);
    }
  };

  useEffect(() => {
    if (category) {
      fetchCategoryData();
    }
  }, [category]);

  const productList = category ? categoryData : products;

  return (
    <div className={`${styles.section} my-5`}>
      <h1 className="font-medium text-2xl">
        {category ? category : "All Products"}
      </h1>
      <div
        className={`grid gap-5 grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] mt-5`}
      >
        {productList?.length > 0 ? (
          productList?.map((product) => (
            <ProductCard key={product?._id} product={product} />
          ))
        ) : (
          <h1 className="font-medium">
            No product found {category && "related to this category"}
          </h1>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
