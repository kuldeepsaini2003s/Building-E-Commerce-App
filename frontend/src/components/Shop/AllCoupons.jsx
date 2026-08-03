import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import axios from "axios";
import styles from "../../utils/styles";
import { useActionState } from "react";
import useResponseHandler from "../../hooks/useResponseHandler";
import { BACKEND_COUPON } from "../../utils/constants";
import useFetchAllProducts from "../../hooks/useFetchAllProducts";
import useFetchAllCouponCodes from "../../hooks/useFetchAllCouponCode";

const AllCoupons = () => {
  useFetchAllProducts();
  useFetchAllCouponCodes();
  const { handleResponse, handleError } = useResponseHandler();
  const [open, setOpen] = useState(false);
  const { products } = useSelector((state) => state?.product);
  const [selectedProduct, setSelectedProduct] = useState("");
  const { couponCodes } = useSelector((state) => state?.couponCode);

  const handleDelete = async (id) => {
    axios
      .delete(`${BACKEND_COUPON}/coupon/delete-coupon/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success("Coupon code deleted succesfully!");
      });
  };

  const [formData, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const name = formData?.get("name") || previousState?.name || "";
      const discount =
        formData?.get("discount") || previousState?.discount || "";
      const minAmount =
        formData?.get("minAmount") || previousState?.minAmount || "";
      const maxAmount =
        formData?.get("maxAmount") || previousState?.maxAmount || "";
      const productId =
        formData?.get("productId") || previousState?.productId || "";

      const toastId = toast.loading("Creating coupon code...  ");

      try {
        const { status, data } = await axios.post(
          BACKEND_COUPON + "/create",
          {
            name,
            minAmount,
            maxAmount,
            productId,
            discount,
          },
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
              setOpen(false);
            },
          });
        }
      } catch (error) {
        handleError({
          error,
          status: error?.response?.status,
          toastId,
          showToast: true,
          message:
            error?.response?.data?.msg || "Failed to create coupon code.",
        });
      }
    }
  );

  const columns = [
    { field: "id", headerName: "Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Coupon Code",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Discount",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "Delete",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params._id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];

  couponCodes &&
    couponCodes.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: item.discount + " %",
        sold: 10,
      });
    });

  return (
    <>
      <div className="w-ful px-4 py-2">
        <div className="w-full flex justify-end">
          <div
            className={`${styles.button} !w-fit !m-0 px-3 !mb-3 !h-fit py-2 !rounded-[5px]`}
            onClick={() => setOpen(true)}
          >
            <span className="text-white">Create Coupon Code</span>
          </div>
        </div>
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
        {open && (
          <div className="fixed top-0 left-0 h-screen w-full bg-[#00000062] z-[20000] flex items-center justify-center">
            <div className="w-[40%] bg-white rounded-md shadow p-4">
              <div className="w-full flex justify-between items-center mb-4">
                <h5 className="text-2xl font-Poppins text-center">
                  Create Coupon code
                </h5>
                <RxCross1
                  size={30}
                  className="cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>
              {/* create coupoun code */}
              <form className="space-y-4" action={submitAction}>
                <div>
                  <label className="pb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData?.name}
                    className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your coupon code name..."
                  />
                </div>
                <div>
                  <label className="pb-2">
                    Discount Percentage <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData?.value}
                    required
                    className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your coupon code value..."
                  />
                </div>
                <div>
                  <label className="pb-2">Min Amount</label>
                  <input
                    type="number"
                    name="minAmount"
                    value={formData?.minAmount}
                    required
                    className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your coupon code min amount..."
                  />
                </div>
                <div>
                  <label className="pb-2">Max Amount</label>
                  <input
                    type="number"
                    name="maxAmount"
                    value={formData?.maxAmount}
                    required
                    className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your coupon code max amount..."
                  />
                </div>
                <div>
                  <label className="pb-2">Selected Product</label>
                  <select
                    className="w-full mt-2 border h-[35px] rounded-[5px]"
                    value={selectedProduct}
                    required
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    name="productId"
                  >
                    <option disabled hidden value="">
                      Select a product
                    </option>
                    {products &&
                      products.map((i) => (
                        <option value={i._id} key={i._id}>
                          {i.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="mt-2
                    block p-2 text-white w-28 bg-blue-500
                    rounded-md focus:outline-none
                    focus:ring-blue-500 focus:border-blue-500 "
                  >
                    Create{" "}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AllCoupons;
