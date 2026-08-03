import { useState } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import useFetchAllProducts from "../../hooks/useFetchAllProducts";

const AllProducts = () => {
  useFetchAllProducts();
  const { products } = useSelector((state) => state?.product);
  const [disable, setDisable] = useState(false);

  const handleDelete = async (id) => {
    setDisable(true);
    // try {
    //   const res = await axios.delete(BACKEND_PRODUCT + id, {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("shopToken")}`,
    //     },
    //   });
    //   if (res.status === 200) {
    //     dispatch(useFetchAllProducts());
    //     setDisable(false);
    //     toast.success(res?.data?.msg);
    //   }
    // } catch (error) {
    //   setDisable(false);
    //   toast.error("Something went wrong please try again");
    // }
  };

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "category",
      headerName: "Category",
      minWidth: 200,
      flex: 0.6,
    },
    {
      field: "Stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },

    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "Preview",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params._id}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 80,
      headerName: "Delete",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <button disabled={disable} onClick={() => handleDelete(params._id)}>
              <AiOutlineDelete size={20} />
            </button>
          </>
        );
      },
    },
  ];

  const row = [];

  products &&
    products.forEach((item) => {
      row.push({
        id: item?._id,
        name: item?.title,
        price: "₹  " + item?.originalPrice,
        Stock: item?.stock,
        sold: item?.sold_out,
        category: item?.category,
      });
    });

  return (
    <>
      <div className="w-full px-4 py-2">
        <h1 className="text-xl mb-2">All products</h1>
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          autoHeight={false}
          // style={{ height: 530 }} // Let DataGrid manage scroll
          disableSelectionOnClick
        />
      </div>
    </>
  );
};

export default AllProducts;
