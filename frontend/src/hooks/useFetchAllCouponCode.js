import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BACKEND_COUPON } from "../utils/constants";
import { useLoading } from "./LoadingProvider";
import axios from "axios";
import { setCouponsCodes } from "../redux/couponCodeSlice";
import useResponseHandler from "./useResponseHandler";

const useFetchAllCouponCodes = () => {
  const { handleError } = useResponseHandler();
  const { couponCodes } = useSelector((state) => state?.couponCode);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const { setIsLoading } = useLoading();
  const userToken = localStorage.getItem("accessToken");
  const shopToken = localStorage.getItem("shopAccessToken");

  const shouldFetch = !couponCodes || couponCodes.length === 0 || !error;

  const url = shouldFetch
    ? `${BACKEND_COUPON}${userToken ? "/couponCode" : "/"}`
    : null;
  const token = shopToken
    ? {
        headers: {
          Authorization: `Bearer ${shopToken}`,
        },
      }
    : undefined;

  const fetchAllCouponCodes = async () => {
    setIsLoading(true);
    try {
      const { status, data } = await axios.get(url, token);
      if (status === 200) {
        setIsLoading(false);
        dispatch(setCouponsCodes(data.data));
      }
    } catch (error) {
      console.log("Error while fetching coupon codes", error);
      setError(true);
      setIsLoading(false);
      handleError({
        error,
        status: error?.response?.status,
        message:
          error?.response?.data?.msg ||
          "Something went wrong please try again...",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (shouldFetch) {
      if (!url) return;
      fetchAllCouponCodes();
    }
  }, [shouldFetch, dispatch]);
};

export default useFetchAllCouponCodes;
