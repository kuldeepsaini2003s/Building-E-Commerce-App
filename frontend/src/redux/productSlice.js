import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  page: 1,
  excludeIds: [],
  loading: false,
  hasMore: true,
  error: false,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    fetchProductsRequest: (state) => {
      state.loading = true;
      state.error = false;
    },
    fetchProductsSuccess: (state, action) => {
      state.loading = false;
      state.products.push(...action.payload.products);
      state.excludeIds.push(...action.payload.products.map((p) => p._id));
      state.page += 1;
      state.hasMore = action.payload.products.length > 0;
    },
    fetchProductsFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    stopFetching: (state) => {
      state.hasMore = false;
    },
    resetProducts: () => initialState,
  },
});

export const {
  fetchProductsRequest,
  fetchProductsSuccess,
  fetchProductsFailure,
  stopFetching,
  resetProducts,
  setProducts,
} = productSlice.actions;

export default productSlice.reducer;
