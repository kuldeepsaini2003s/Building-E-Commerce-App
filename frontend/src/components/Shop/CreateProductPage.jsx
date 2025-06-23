import { useActionState, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { BACKEND_PRODUCT, categoriesData } from "../../utils/constants";
import useResponseHandler from "../../hooks/useResponseHandler";
import TagInput from "./TagInput";
import { AiOutlinePlusCircle, AiOutlineDelete } from "react-icons/ai";

const CreateProduct = () => {
  const { handleResponse, handleError } = useResponseHandler();
  const [tags, setTags] = useState([]);
  const [tagError, setTagError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [preview, setPreview] = useState([]);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const [category, setCategory] = useState("");

  const handleDeleteImage = (indexToRemove) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(preview[indexToRemove].url);
    setPreview((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const [formData, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const title = formData?.get("title") || previousState?.title || "";
      const description =
        formData?.get("description") || previousState?.description || "";
      const originalPrice =
        formData?.get("originalPrice") || previousState?.originalPrice || "";
      const discountPrice =
        formData?.get("discountPrice") || previousState?.discountPrice || "";
      const stock = formData?.get("stock") || previousState?.stock || "";

      const formPreviousData = {
        title,
        description,
        tags,
        discountPrice,
        originalPrice,
        stock,
      };

      if (!tags || tags.length === 0) {
        setTagError(true);
        toast.error("At least one tag is required.");
        return formPreviousData;
      }

      if (!images || images.length === 0) {
        setImageError(true);
        toast.error("At least one image is required.");
        return formPreviousData;
      }

      const toastId = toast.loading("Creating product...");

      const newForm = new FormData();

      images.forEach((image) => {
        newForm.append("images", image.file);
      });

      newForm.append("title", title);
      newForm.append("description", description);
      newForm.append("category", category);
      newForm.append("tags", tags.join(","));
      newForm.append("originalPrice", originalPrice);
      newForm.append("discountPrice", discountPrice);
      newForm.append("stock", stock);

      try {
        const { status, data } = await axios.post(
          BACKEND_PRODUCT + "/create",
          newForm,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "shopAccessToken"
              )}`,
            },
          }
        );
        if (status === 200) {
          handleResponse({
            status: status,
            message: data.msg,
            toastId,
            showToast: true,
            onSuccess: () => {
              navigate("/dashboard-products");
            },
          });
        }
      } catch (error) {
        handleError({
          error,
          status: error?.response?.status,
          toastId,
          showToast: true,
          message: error?.response?.data?.msg || "Failed to create product.",
        });
        return formPreviousData;
      }
    }
  );

  const handleImageChange = (e) => {
    setImageError(false);
    let files = Array.from(e.target.files);

    // ✅ Sort by number in the filename
    files.sort((a, b) => {
      const getNum = (name) => {
        const match = name.match(/\d+/g); // extract all numbers
        return match ? parseInt(match[match.length - 1]) : 0; // use last number
      };
      return getNum(a.name) - getNum(b.name);
    });

    const newPreview = files.map((file) => ({
      url: URL.createObjectURL(file),
    }));

    const newImages = files.map((file) => ({ file }));

    setPreview((prev) => [...prev, ...newPreview]);
    setImages((prev) => [...prev, ...newImages]);

    e.target.value = "";
  };

  return (
    <div className="w-full pb-10 px-4 py-2 rounded-[4px]">
      <h5 className="text-[30px] font-Poppins text-center">Create Product</h5>
      {/* Create product form */}
      <form action={submitAction}>
        <br />
        <div>
          <label className="pb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData?.title}
            required
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your product name..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            required
            rows="8"
            type="text"
            name="description"
            value={formData?.description}
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your product description..."
          ></textarea>
        </div>
        <br />
        <div>
          <div>
            {/* Main Category */}
            <label className="pb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full mt-2 px-2 border h-[35px] rounded-[5px] mb-5"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              name="category"
              required
            >
              <option disabled hidden value="">
                Choose a category
              </option>
              {categoriesData?.map((cat, index) => (
                <option key={index} value={cat?.title}>
                  {cat?.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <br />
        <TagInput
          tags={tags}
          setTags={setTags}
          error={tagError}
          setError={setTagError}
        />
        <br />
        <div>
          <label className="pb-2">Original Price</label>
          <input
            type="number"
            name="originalPrice"
            required
            step="0.01"
            value={formData?.originalPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your product price..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Price (With Discount) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="discountPrice"
            required
            step="0.01"
            value={formData?.discountPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your product price with discount..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Product Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="stock"
            required
            value={formData?.stock}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your product stock..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name=""
            id="upload"
            className="hidden"
            multiple
            onChange={handleImageChange}
          />

          <div className="w-full">
            <label
              htmlFor="upload"
              className="cursor-pointer w-fit text-white mt-2 text-sm bg-blue-500 rounded-md px-4 py-2 flex items-center gap-2"
            >
              Add New
              <AiOutlinePlusCircle size={18} />
            </label>

            <div className="mt-2 grid gap-2 grid-cols-[repeat(auto-fill,minmax(140px,_1fr))]">
              {preview &&
                preview.map((i, index) => (
                  <div key={i.url} className="relative group">
                    <img
                      src={i.url}
                      className="w-64 rounded-md object-cover h-24"
                      style={{ imageRendering: "auto" }}
                      alt="productImages"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-1 right-1 bg-white p-1 rounded-full shadow group-hover:opacity-100 opacity-0 transition-opacity"
                    >
                      <AiOutlineDelete size={18} className="text-red-600" />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {imageError && images.length === 0 && (
            <p className="text-red-500 text-sm mt-1">
              At least one image is required.
            </p>
          )}
          <br />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="mt-2 block cursor-pointer p-2 text-white w-28 bg-blue-500 rounded-md"
            >
              Create
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
