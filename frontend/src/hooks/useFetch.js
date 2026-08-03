import { useEffect, useState } from "react";
import { useLoading } from "./LoadingProvider";
import { useRef } from "react";
import useResponseHandler from "./useResponseHandler";

const useFetch = (url, options = {}) => {
  const { handleError } = useResponseHandler();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { setIsLoading } = useLoading();
  const hasFetched = useRef(false);
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (!url || hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      try {
        const data = await fetch(url, options);
        const json = await data.json();
        if (json) {
          setData(json?.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error while fetching data", error);
        setError(error);
        setIsLoading(false);
        handleError({
          error,
          status: error?.response?.status,
          message:
            error?.response?.data?.msg ||
            "Something went wrong please try again...",
        });
      } finally {
        scrollTop();
      }
    };
    fetchData();
  }, [url]);

  return { data, error };
};

export default useFetch;
