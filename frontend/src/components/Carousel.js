import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import img1 from "../images/Upcoming-Amazon-Sales-in-India.jpg";
import img2 from "../images/amazon-republic-day-sale.jpg";
import img3 from "../images/amazon_banner.jpg";
import img4 from "../images/download.jpeg";
import img5 from "../images/images.jpeg";

export default function App() {
  const data = [img1, img2, img3, img4, img5];
  return (
    <div className="full">
      <Swiper
        navigation={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Navigation, Autoplay]}
        className="mySwiper w-full h-[75vh] "
      >
        {data.map((item, index) => (
          <SwiperSlide key={index}>
            <img
              src={item}
              alt=""
              className="w-full h-full object-center object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
