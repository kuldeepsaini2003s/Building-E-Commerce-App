import { Link } from "react-router-dom";
import styles from "../../../utils/styles";

const Hero = () => {
  return (
    <div
      className={`relative min-h-[80vh] 800px:min-h-[80vh] w-full bg-no-repeat ${styles.normalFlex}`}
      style={{
        backgroundImage:
          "url(https://themes.rslahmed.dev/rafcart/assets/images/banner-2.jpg)",
      }}
    >
      <div className={`${styles.section} min-[800px]:w-[60%]`}>
        <h1
          className={`min-[850px]:text-6xl min-[340px]:text-4xl text-3xl font-semibold leading-[1.2] text-[#3d3a3a] font-[600] capitalize`}
        >
          Best Collection for <br /> home Decoration
        </h1>
        <p className="pt-5 text-[16px] font-[Poppins] font-[400] text-[#000000ba]">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae,
          assumenda? Quisquam itaque <br /> exercitationem labore vel, dolore
          quidem asperiores, laudantium temporibus soluta optio consequatur{" "}
          <br /> aliquam deserunt officia. Dolorum saepe nulla provident.
        </p>
        <Link to="/products" className="inline-block">
        <div className={`${styles.button} mt-5`}>
          <span className="text-[#fff] font-[Poppins] text-[18px]">
            Shop Now
          </span>
        </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
