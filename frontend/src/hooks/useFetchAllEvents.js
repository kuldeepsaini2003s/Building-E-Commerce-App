import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BACKEND_EVENT } from "../utils/constants";
import { setEvents } from "../redux/eventSlice";
import { useLoading } from "./LoadingProvider";
import axios from "axios";
import useResponseHandler from "./useResponseHandler";

const useFetchAllEvents = () => {
  const { handleError } = useResponseHandler();
  const { events } = useSelector((state) => state?.event);
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const { setIsLoading } = useLoading();
  const userToken = localStorage.getItem("accessToken");
  const shopToken = localStorage.getItem("shopAccessToken");

  const shouldFetch = !events || events.length === 0 || !error;
  const url = shouldFetch
    ? `${BACKEND_EVENT}${userToken ? "/events" : "/"}`
    : null;
  const token = shopToken
    ? {
        headers: {
          Authorization: `Bearer ${shopToken}`,
        },
      }
    : undefined;

  const fetchAllEvents = async () => {
    try {
      const { status, data } = await axios.get(url, token);
      if (status === 200) {
        setIsLoading(false);
        dispatch(setEvents(data.data));
      }
    } catch (error) {
      console.log("Error while fetching events", error);
      setError(true);
      setIsLoading(false);
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
      fetchAllEvents();
    }
  }, [shouldFetch, dispatch]);
};

export default useFetchAllEvents;
