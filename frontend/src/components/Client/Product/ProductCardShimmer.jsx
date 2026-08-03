const ShimmerProductCard = () => {
  return (
    <>
      {Array(10)
        .fill(0)
        .map((_, i) => (
          <div className="w-full bg-white rounded-lg shadow-xl overflow-hidden animate-pulse">
            {/* Image Section */}
            <div className="relative rounded-lg p-4 mb-2">
              <div className="w-full h-40 bg-gray-300 rounded-md" />
            </div>

            {/* Product Info */}
            <div className="px-4 pb-4 flex flex-col gap-2 justify-center">
              {/* Seller Name */}
              <div className="h-4 w-24 bg-gray-300 rounded-md" />

              {/* Title */}
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-300 rounded-md" />
                <div className="h-4 w-[70%] bg-gray-300 rounded-md" />
              </div>

              {/* Stars */}
              <div className="flex gap-2 mt-1">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="w-5 h-5 bg-gray-300 rounded-md" />
                  ))}
              </div>

              {/* Price Section */}
              <div className="flex items-baseline gap-2 mt-1">
                <div className="h-4 w-16 bg-gray-300 rounded-md" />
                <div className="h-4 w-12 bg-gray-300 rounded-md" />
                <div className="ml-auto h-4 w-12 bg-gray-300 rounded-md" />
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default ShimmerProductCard;
