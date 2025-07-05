import { toast } from "react-toastify";
import useRefreshToken from "./useRefreshToken";
import { useLoading } from "./LoadingProvider";

const useResponseHandler = () => {
  const { setIsLoading } = useLoading();
  const { refreshAccessToken } = useRefreshToken();
  const handleResponse = ({
    status,
    message,
    onSuccess = () => {},
    toastId,
    showToast = false,
  }) => {
    if (status === 200 || status === 201) {
      onSuccess();
      setIsLoading(false);
      if (showToast) {
        toast.update(toastId, {
          render: message,
          type: "success",
          isLoading: false,
          autoClose: 3000,
          pauseOnFocusLoss: false,
          closeOnClick: true,
        });
      }
    }
  };

  const handleError = ({
    error,
    toastId,
    message = "Something went wrong!",
    showToast = false,
  }) => {
    console.error("Error:", error);
    if (error?.response?.status === 401) {
      refreshAccessToken();
    }
    setIsLoading(false);
    if (showToast) {
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
        pauseOnFocusLoss: false,
        closeOnClick: true,
      });
    }
  };

  return { handleResponse, handleError };
};

export default useResponseHandler;
