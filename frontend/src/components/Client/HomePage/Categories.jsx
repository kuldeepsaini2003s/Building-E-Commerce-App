import { Link } from "react-router-dom";
import styles from "../../../utils/styles";
import { brandingData, categoriesData } from "../../../utils/constants";

const Categories = () => {
  return (
    <>
      <div className={`${styles.section} hidden sm:block`}>
        <div
          className={`my-12 place-items-center grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-y-10 shadow-xl w-full p-5 rounded-md`}
        >
          {brandingData &&
            brandingData.map((i, index) => (
              <div className="flex items-start" key={index}>
                {i.icon}
                <div className="px-3">
                  <h3 className="font-bold text-sm md:text-base">{i.title}</h3>
                  <p className="text-xs md:text-sm">{i.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div
        className={`${styles.section} bg-white sm:p-6 p-4 rounded-lg shadow-xl my-10`}
        id="categories"
      >
        <div className="grid place-items-center gap-y-5 grid-cols-2 min-[500px]:grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))]">
          {categoriesData &&
            categoriesData.map((i) => (
              <Link key={i._id} to={`/products?category=${i.title}`}>
                <div
                  className="w-full h-fit gap-2 flex flex-col items-center justify-between cursor-pointer"
                  key={i._id}
                >
                  <img
                    src={i.url}
                    className="w-[130px] h-[90px] rounded-xl object-center mix-blend-multiply object-contain"
                    alt="Category Image"
                  />
                  <h5 className={`max-sm:text-center leading-[1.3]`}>
                    {i.title}
                  </h5>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
};

export default Categories;
