import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";

const DashboardHeader = () => {
  const { shop } = useSelector((state) => state?.shop);
  return (
    <div className="w-full h-[55px] bg-white border-b border-gray-400 sticky top-0 left-0 z-30 flex items-center justify-between px-4 py-1">
      <Link to="/dashboard">
        <img className="rounded-lg w-32" src="/logo.svg" alt="" />
      </Link>
      <div className="flex items-center">
        {shop?.avatar ? (
          <Link to={`/shop/${shop?._id}`}>
            <img
              src={`${shop?.avatar}`}
              alt="shop image"
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
          </Link>
        ) : (
          <FaRegCircleUser size={25} />
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
