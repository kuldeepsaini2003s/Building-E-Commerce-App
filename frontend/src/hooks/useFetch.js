import { useEffect, useState } from "react";
import { useLoading } from "./LoadingProvider";

const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);  
  const { setIsLoading } = useLoading();
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetch(url, options);
        const json = await data.json();
        if (json) {
          setData(json);
        }
      } catch (error) {
        console.error("Error while fetching data", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { data, error };
};

export default useFetch;
