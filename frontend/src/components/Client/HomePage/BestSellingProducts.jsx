import { useSelector } from "react-redux";
import ProductCard from "../Product/ProductCard";
import styles from "../../../utils/styles";

const BestSellingProducts = () => {
  const { products } = useSelector((state) => state.product);
  // show only 15 products
  const limitedProducts = products?.slice(0, 16);

  return (
    <div className={`${styles.section} my-5`}>
      <h1 className="font-medium text-xl">Best Selling</h1>
      <div
        className={`grid gap-5 grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] mt-5`}
      >
        {limitedProducts?.map((product) => (
          <ProductCard key={product?._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default BestSellingProducts;
