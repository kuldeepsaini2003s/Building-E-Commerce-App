// MagnifierImage.js
import { useRef, useEffect } from "react";

const MagnifierImage = ({ src, alt }) => {
  const lensRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const lens = lensRef.current;
    if (lens) {
      lens.style.backgroundImage = `url('${src}')`;
      lens.style.backgroundRepeat = "no-repeat";
    }
  }, [src]);

  const handleMouseMove = (e) => {
    const lens = lensRef.current;
    const img = imgRef.current;
    const rect = img.getBoundingClientRect();

    const zoom = 2.5;
    const lensSize = 200; // Increased size

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      lens.style.display = "none";
      return;
    }

    const lensX = x - lensSize / 2;
    const lensY = y - lensSize / 2;

    lens.style.display = "block";
    lens.style.left = `${lensX}px`;
    lens.style.top = `${lensY}px`;
    lens.style.backgroundSize = `${img.width * zoom}px ${img.height * zoom}px`;
    lens.style.backgroundPosition = `-${x * zoom - lensSize / 2}px -${
      y * zoom - lensSize / 2
    }px`;
  };

  const handleMouseLeave = () => {
    const lens = lensRef.current;
    if (lens) lens.style.display = "none";
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-full object-contain"
      />
      <div
        ref={lensRef}
        className="absolute z-50 rounded-full border-2 border-gray-500 shadow-xl"
        style={{
          width: "200px", // Updated size
          height: "200px", // Updated size
          display: "none",
          position: "absolute",
          pointerEvents: "none",
        }}
      ></div>
    </div>
  );
};

export default MagnifierImage;
