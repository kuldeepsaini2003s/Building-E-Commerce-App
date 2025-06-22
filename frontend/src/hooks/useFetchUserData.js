import axios from "axios";
import { useDispatch } from "react-redux";
import { BACKEND_SHOP, BACKEND_USER } from "../utils/constants";
import useResponseHandler from "./useResponseHandler";
import { setUser } from "../redux/userSlice";
import { setShop } from "../redux/shopSlice";
import { useEffect } from "react";

const useFetchUserData = () => {
  const { handleResponse, handleError } = useResponseHandler();
  const shopToken = localStorage.getItem("shopAccessToken");
  const userToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();

  const fetchUserDetails = async () => {
    const isUser = !!userToken;
    const url = `${isUser ? BACKEND_USER : BACKEND_SHOP}/`;

    try {
      const { status, data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${isUser ? userToken : shopToken}`,
        },
      });
      if (status === 200) {
        handleResponse({
          status: status,
          message: data.msg,
          onSuccess: () => {
            if (isUser) {
              dispatch(setUser(data?.data));
            } else {
              dispatch(setShop(data?.data));
            }
          },
        });
      }
    } catch (error) {
      console.error(`Error while fetching ${isUser ? "user" : "shop"} details`);
      handleError({
        error,
        status: error?.response?.status,
        toastId,
        message:
          error?.response?.data?.msg ||
          "Something went wrong please try again...",
      });
    }
  };

  useEffect(() => {
    if (shopToken || userToken) {
      fetchUserDetails();
    }
  }, [shopToken, userToken]);
};

export default useFetchUserData;
