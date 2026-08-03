import { useDispatch, useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import styles from "../../../utils/styles";
import { useSearchParams } from "react-router-dom";
import { BACKEND_PRODUCT } from "../../../utils/constants";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLoading } from "../../../hooks/LoadingProvider";
import { fetchProducts } from "../../../redux/actions/productAction";
import ShimmerProductCard from "./ProductCardShimmer";

const AllProducts = () => {
  const dispatch = useDispatch();
  const loaderRef = useRef();
  const { products, loading, hasMore, error } = useSelector(
    (state) => state.product
  );
  const [searchParams] = useSearchParams();
  const category = searchParams?.get("category");
  const [categoryData, setCategoryData] = useState([]);
  const { setIsLoading } = useLoading();

  const loadMore = useCallback(() => {
    if (loading || error || !hasMore || category) return;
    dispatch((dispatch, getState) =>
      fetchProducts(dispatch, getState, setIsLoading)
    );
  }, [dispatch, loading, hasMore, category, setIsLoading]);

  useEffect(() => {
    if (!category && !loading && !error && hasMore) {
      loadMore();
    }
  }, []);

  useEffect(() => {
    if (!loaderRef.current && !error) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    const target = loaderRef.current;
    if (target) observer.observe(target);

    return () => target && observer.unobserve(target);
  }, [loadMore]);

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
      console.error("Error while fetching data by category", error);
      setIsLoading(false);
      setCategoryData([]);
    } finally {
      setIsLoading(false);
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
        {loading && !category && <ShimmerProductCard />}
      </div>
      {!category && hasMore && <div ref={loaderRef} className="h-4" />}
    </div>
  );
};

export default AllProducts;
