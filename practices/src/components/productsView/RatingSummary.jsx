import Rating from "../../components/Rating";
import { countConverter } from "../../functions/eventHandlingFn";
import { ratingProgress } from "../../api/rating_Reviews";
import { useState, useEffect } from "react";

const RatingSummary = ({ ratingCount, rating, productId, userId }) => {
  // ratings = { 5: 120, 4: 80, 3: 40, 2: 10, 1: 5 }

  const [progress, setProgress] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await ratingProgress(userId, productId);
        setProgress(data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, [productId]);

  return (
    <div className="p-5 border rounded-lg bg-white shadow-md flex flex-col  w-full">
      {/* Average rating */}
      <div className="text-center mb-5 flex flex-col justify-center items-center bg-white">
        <h2 className="text-5xl font-semibold">{rating.toFixed(1)}</h2>
        <Rating size={"medium"} value={rating.toFixed(1)} color={"#02213b"} />
        <p className="text-gray-500">{countConverter(ratingCount)} rated</p>
      </div>

      {/* Rating distribution */}
      <div className="space-y-2 bg-white">
        {[5, 4, 3, 2, 1]?.map((star) => {
          return (
            <div key={star} className="flex items-center gap-3 bg-white">
              <span className="w-8 text-sm">{star} ★</span>
              <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-[#000f50] h-full rounded-full"
                  style={{ width: `${progress[star]}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">{progress[star]}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RatingSummary;
