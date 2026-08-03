import { useEffect, useState } from "react";
import styles from "../../../utils/styles";
import ProductCard from "./ProductCard";
import { useSelector } from "react-redux";

const BestSelling = () => {
  const { products } = useSelector((state) => state.product);
  const [BestSellingProducts, setBestSellingProducts] = useState([]);

  useEffect(() => {
    const filteredProducts = products.filter(
      (product) => product?.isBestSelling
    );
    setBestSellingProducts(filteredProducts);
  }, [products]);

  return (
    <div className={`${styles.section} my-5`}>
      <h1 className="font-medium text-xl">Best Selling</h1>
      <div
        className={`grid gap-5 grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] mt-5`}
      >
        {BestSellingProducts?.map((product) => (
          <ProductCard key={product?._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default BestSelling;
