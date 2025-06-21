import { useEffect, useState } from "react";
import { useLoading } from "./LoadingProvider";
import { useRef } from "react";

const useFetch = (url, options = {}) => {
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
      setIsLoading(true);
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
      } finally {
        scrollTop();
      }
    };
    fetchData();
  }, [url]);

  return { data, error };
};

export default useFetch;
