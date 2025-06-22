import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { LoadingProvider } from "./hooks/LoadingProvider.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { Slide, ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LoadingProvider>
      <Provider store={store}>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
          theme="light"
          style={{ width: "fit-content" }}
          bodyClassName="toastContainer"
          transition={Slide}
        />
      </Provider>
    </LoadingProvider>
  </StrictMode>
);
