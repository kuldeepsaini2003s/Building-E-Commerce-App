import { useActionState, useState } from "react";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_EVENT, categoriesData } from "../../utils/constants";
import { toast } from "react-toastify";
import useResponseHandler from "../../hooks/useResponseHandler";
import TagInput from "./TagInput";

const CreateEvent = () => {
  const { handleResponse, handleError } = useResponseHandler();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagError, setTagError] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleStartDateChange = (e) => {
    const startDate = new Date(e.target.value);
    const minEndDate = new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    setStartDate(startDate);
    setEndDate(null);
    document.getElementById("end-date").min = minEndDate
      .toISOString()
      .slice(0, 10);
  };

  const handleEndDateChange = (e) => {
    const endDate = new Date(e.target.value);
    setEndDate(endDate);
  };

  const today = new Date().toISOString().slice(0, 10);

  const minEndDate = startDate
    ? new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10)
    : "";

  const handleImageChange = (e) => {
    setImageError(false);
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      const newItems = files.map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));

      setPreview((prev) => [
        ...prev,
        ...newItems.map((item) => ({ url: item.url })),
      ]);
      setImages((prev) => [
        ...prev,
        ...newItems.map((item) => ({ file: item.file })),
      ]);
    }

    e.target.value = "";
  };

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
        category,
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
      newForm.append("startDate", startDate?.toISOString());
      newForm.append("endDate", endDate?.toISOString());

      const toastId = toast.loading("Creating Event...");

      try {
        const { status, data } = await axios.post(
          BACKEND_EVENT + "/create",
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
            message: data?.msg,
            toastId,
            showToast: true,
            onSuccess: () => {
              navigate("/dashboard-events");
            },
          });
        }
      } catch (error) {
        handleError({
          error,
          status: error?.response?.status,
          toastId,
          showToast: true,
          message: error?.response?.data?.msg || "Failed to create event.",
        });
        return formPreviousData;
      }
    }
  );

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  return (
    <div className="bg-white px-4 py-2 pb-10 rounded-xl">
      <h5 className="text-[30px] font-Poppins text-center">Create Event</h5>
      {/* create event form */}
      <form action={submitAction}>
        <div>
          <label className="pb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData?.title}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your event product name..."
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
            placeholder="Enter your event product description..."
          ></textarea>
        </div>
        <br />
        <div>
          {/* Main Category */}
          <label>
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={category}
            required
            name="category"
            onChange={handleCategoryChange}
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
        <br />
        <TagInput
          tags={tags}
          setTags={setTags}
          error={tagError}
          setError={setTagError}
        />
        <br />
        <div>
          <label className="pb-2">
            Original Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="originalPrice"
            required
            step="0.01"
            value={formData?.originalPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your event product price..."
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
            placeholder="Enter your event product price with discount..."
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
            placeholder="Enter your event product stock..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Event Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="startDate"
            id="start-date"
            required
            value={startDate ? startDate.toISOString().slice(0, 10) : ""}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleStartDateChange}
            min={today}
            placeholder="Enter your event product stock..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Event End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="endDate"
            id="start-date"
            required
            value={endDate ? endDate.toISOString().slice(0, 10) : ""}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleEndDateChange}
            min={minEndDate}
            placeholder="Enter your event product stock..."
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
              className="mt-2 block p-2 text-white w-28 bg-blue-500 rounded-md cursor-pointer"
            >
              Create{" "}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
