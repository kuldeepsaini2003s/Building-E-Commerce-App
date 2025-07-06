import { useRef } from "react";

const magnifierImage = ({ src, alt, onZoom, onZoomEnd }) => {
  const imgRef = useRef(null);
  const zoom = 2.5;
  const lensSize = 120;

  const handleMouseMove = (e) => {
    const img = imgRef.current;
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      onZoomEnd?.();
      return;
    }

    const lensX = Math.max(
      0,
      Math.min(x - lensSize / 2, rect.width - lensSize)
    );
    const lensY = Math.max(
      0,
      Math.min(y - lensSize / 2, rect.height - lensSize)
    );

    const bgX = -(lensX * zoom);
    const bgY = -(lensY * zoom);

    onZoom?.({
      lensX,
      lensY,
      bgX,
      bgY,
      bgWidth: rect.width * zoom,
      bgHeight: rect.height * zoom,
    });
  };

  const handleMouseLeave = () => {
    onZoomEnd?.();
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
    </div>
  );
};

export default magnifierImage;
