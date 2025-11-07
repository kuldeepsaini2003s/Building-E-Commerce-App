import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BACKEND_PRODUCT } from "../utils/constants";
import { useLoading } from "./LoadingProvider";
import axios from "axios";
import { setProducts } from "../redux/productSlice";
import useResponseHandler from "./useResponseHandler";

const useFetchAllProducts = () => {
  const { handleError } = useResponseHandler();
  const { products } = useSelector((state) => state?.product);
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const { setIsLoading } = useLoading();
  const userToken = localStorage.getItem("accessToken");
  const shopToken = localStorage.getItem("shopAccessToken");


  const shouldFetch = !products || products.length === 0 || !error;

  const url = shouldFetch
    ? `${BACKEND_PRODUCT}${!shopToken ? "/products" : "/"}`
    : null;

  const token = shopToken
    ? {
        headers: {
          Authorization: `Bearer ${shopToken}`,
        },
      }
    : undefined;

  const fetchAllProducts = async () => {
    try {
      const { status, data } = await axios.get(url, token);
      if (status === 200) {
        setIsLoading(false);
        dispatch(setProducts(data.data));
      }
    } catch (error) {
      console.log("Error while fetching products", error);
      setIsLoading(false);
      setError(true);
      handleError({
        error,
        status: error?.response?.status,
        message:
          error?.response?.data?.msg ||
          "Something went wrong please try again...",
      });
    }
  };

  useEffect(() => {
    if (shouldFetch) {
      if (!url) return;
      fetchAllProducts();
    }
  }, [shouldFetch, dispatch]);
};

export default useFetchAllProducts;
