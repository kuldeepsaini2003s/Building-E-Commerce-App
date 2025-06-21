import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BACKEND_EVENT } from "../utils/constants";
import { setEvents } from "../redux/eventSlice";
import { useLoading } from "./LoadingProvider";
import axios from "axios";

const useFetchAllEvents = () => {
  const { events } = useSelector((state) => state?.event);
  const dispatch = useDispatch();
  const { setIsLoading } = useLoading();
  const userToken = localStorage.getItem("accessToken");
  const shopToken = localStorage.getItem("shopAccessToken");

  const shouldFetch = !events || events.length === 0;
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
    setIsLoading(true);
    try {
      const { status, data } = await axios.get(url, token);
      if (status === 200) {
        setIsLoading(false);
        dispatch(setEvents(data.data));
      }
    } catch (error) {
      console.log("Error while fetching events", error);
      setIsLoading(false);
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
