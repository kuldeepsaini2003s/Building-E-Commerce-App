import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineCamera } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "../../utils/styles";
import { BACKEND_SHOP } from "../../utils/constants";
import useResponseHandler from "../../hooks/useResponseHandler";
import { setShop } from "../../redux/shopSlice";

const ShopSettings = () => {
  const { handleResponse, handleError } = useResponseHandler();
  const { shop } = useSelector((state) => state?.shop);
  const [disabled, setDisabled] = useState(false);
  const [shopDetails, setShopDetails] = useState({
    name: "",
    description: "",
    phoneNumber: "",
    avatar: "",
  });
  const [previousShopDetails, setPreviousShopDetails] = useState({
    name: "",
    description: "",
    phoneNumber: "",
    avatar: "",
  });
  const [preview, setPreview] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (shop) {
      const newDetails = {
        name: shop?.name || "",
        description: shop?.description || "",
        phoneNumber: shop?.phoneNumber || "",
        avatar: shop?.avatar || "",
      };
      setShopDetails(newDetails);
      setPreviousShopDetails(newDetails);
      setPreview(shop?.avatar);
    }
  }, [shop]);

  const handleImage = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setShopDetails((prev) => ({ ...prev, avatar: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (shopDetails === previousShopDetails) return;

    setDisabled(true);
    const toastId = toast.loading("please wait...");

    const formData = new FormData();

    const { name, description, phoneNumber, avatar } = shopDetails;

    formData.append("name", name?.trim(""));
    formData.append("description", description?.trim(""));
    formData.append("phoneNumber", phoneNumber);
    formData.append("avatar", avatar);

    try {
      const { data, status } = await axios.put(`${BACKEND_SHOP}/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("shopAccessToken")}`,
        },
      });
      if (status === 200) {
        handleResponse({
          status: status,
          message: data?.msg,
          toastId,
          showToast: true,
          onSuccess: () => {
            setDisabled(false);
            dispatch(setShop(data?.data));
          },
        });
      }
    } catch (error) {
      handleError({
        error,
        status: error?.response?.status,
        toastId,
        showToast: true,
        message: error?.response?.data?.msg || "Failed to update shop details.",
      });
      setDisabled(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShopDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex w-full flex-col justify-center">
        <div className="w-full flex items-center justify-center">
          <div className="relative">
            <img
              src={preview}
              alt=""
              className="w-48 h-48 object-cover rounded-full cursor-pointer"
            />
            <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[10px] right-[15px]">
              <input
                type="file"
                id="image"
                className="hidden"
                onChange={handleImage}
              />
              <label htmlFor="image">
                <AiOutlineCamera />
              </label>
            </div>
          </div>
        </div>

        {/* shop info */}
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <div className="w-[100%] flex items-center flex-col">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop Name</label>
            </div>
            <input
              type="name"
              placeholder="name"
              name="name"
              value={shopDetails?.name}
              onChange={handleInputChange}
              className={`${styles.input} !w-[95%] mb-2 px-2 800px:mb-0`}
              required
            />
          </div>
          <div className="w-[100%] flex items-center flex-col">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop description</label>
            </div>
            <textarea
              type="name"
              placeholder="description"
              name="description"
              value={shopDetails?.description}
              onChange={handleInputChange}
              rows={"8"}
              className={`${styles.input} resize-none !w-[95%] px-2 mb-2 800px:mb-0`}
            />
          </div>

          <div className="w-[100%] flex items-center flex-col">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Phone Number</label>
            </div>
            <input
              type="number"
              placeholder="phone number"
              name="phone"
              value={shopDetails?.phoneNumber}
              onChange={handleInputChange}
              className={`${styles.input} !w-[95%] px-2 mb-2 800px:mb-0`}
              required
            />
          </div>

          <div className="w-[100%] flex items-center flex-col mt-2">
            <button
              type="submit"
              disabled={disabled}
              className={`${styles.input} button bg-blue-500 text-white !w-[95%] mb-4 800px:mb-0`}
            >
              Update Shop
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopSettings;
