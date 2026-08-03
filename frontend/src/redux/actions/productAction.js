import axios from "axios";
import { BACKEND_PRODUCT } from "../../utils/constants";
import {
  fetchProductsFailure,
  fetchProductsRequest,
  fetchProductsSuccess,
  stopFetching,
} from "../productSlice";

export const fetchProducts = async (dispatch, getState, setIsLoading) => {
  const { page, excludeIds, hasMore, loading } = getState().product;

  if (!hasMore || loading) return;

  if (page === 1) {
    setIsLoading(true);
  }
  dispatch(fetchProductsRequest());

  try {
    const { status, data } = await axios.get(
      `${BACKEND_PRODUCT}/products?page=${page}&limit=20&excludeIds=${excludeIds.join(
        ","
      )}`
    );

    if (status === 204) {
      dispatch(stopFetching());
      setIsLoading(false);
      return;
    }
    dispatch(fetchProductsSuccess({ products: data?.data || [] }));
  } catch (err) {
    dispatch(fetchProductsFailure());
    console.error("Error fetching products:", err);
  } finally {
    setIsLoading(false); // ✅ always stop loader
  }
};

// export const fetchProductsByCategory = async (
//   dispatch,
//   category,
//   setIsLoading
// ) => {
//   dispatch({ type: "FETCH_PRODUCTS_REQUEST" });

//   try {
//     const response = await fetch(`/api/products?category=${category}`);

//     if (response.status === 204) {
//       dispatch({ type: "STOP_FETCHING" });
//       setIsLoading(false);
//       return;
//     }

//     const data = await response.json();

//     dispatch({
//       type: "FETCH_PRODUCTS_SUCCESS",
//       payload: { products: data },
//     });
//     setIsLoading(false);
//   } catch (err) {
//     setIsLoading(false);
//     dispatch({
//       type: "FETCH_PRODUCTS_FAILURE",
//       payload: err.message || "Something went wrong",
//     });
//   }
// };
