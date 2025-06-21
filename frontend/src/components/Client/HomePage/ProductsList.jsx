import ProductCard from "../ProductCard";
import styles from "../../../utils/styles";
import useFetch from "../../../hooks/useFetch";

const ProductsList = () => {
  const { data } = useFetch("https://fakestoreapi.com/products");

  return (
    <div className={`${styles.section} grid gap-5 grid-cols-5 mb-10`}>
      {data?.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductsList;
