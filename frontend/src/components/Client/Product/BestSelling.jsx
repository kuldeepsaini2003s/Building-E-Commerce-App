import styles from "../../../utils/styles";
import ProductCard from "./ProductCard";
import { useSelector } from "react-redux";

const BestSelling = () => {
  const { products } = useSelector((state) => state.product);

  return (
    <div className={`${styles.section} my-5`}>
      <h1 className="font-medium text-xl">Best Selling</h1>
      <div
        className={`grid gap-5 grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] mt-5`}
      >
        {products?.map((product) => (
          <ProductCard key={product?._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default BestSelling;
