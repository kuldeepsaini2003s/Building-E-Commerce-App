import { Link } from "react-router-dom";
import { categoriesData } from "../../../../utils/constants";
import styles from "../../../../utils/styles";

const DropDown = ({ setDropDown }) => {
  return (
    <div className="pb-4 w-[16rem] rounded-b-md text-black bg-[#fff] absolute z-30 rounded-b-md shadow-sm">
      {categoriesData &&
        categoriesData.map((i, index) => (
          <Link key={index} to={`/products?category=${i.title}`}>
            <div
              key={index}
              className={`${styles.normalFlex} relative px-2 text-sm my-1 hover:bg-gray-200`}
              onClick={() => setDropDown(false)}
            >
              <img
                src={i?.url}
                className="w-10 object-contain mix-blend-multiply"
                alt="Category Image"
              />
              <h3 className="m-3 cursor-pointer select-none">{i.title}</h3>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default DropDown;
