import { CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";

const WriteReview = ({ Loading, success, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  function clenUp() {
    setRating(0);
    setReview("");
  }

  useEffect(() => {
    if (success) {
      clenUp();
    }
    return;
  }, [success]);

  return (
    <div className="p-5 border w-full bg-white rounded-lg shadow-md mt-6">
      <h3 className="font-semibold text-lg mb-3">Write a Review</h3>

      {/* star rating selector */}
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-3xl cursor-pointer transition ${
              star <= rating ? "text-[#000f50]" : "text-gray-400"
            }`}
            onClick={() => setRating(star)}
          >
            ★
          </span>
        ))}
      </div>

      <textarea
        rows="4"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Share your thoughts on this product..."
        className="w-full border rounded-md p-3 focus:outline-blue-400"
      />

      <button
        onClick={() => onSubmit({ rating, review })}
        type="submit"
        disabled={!rating || review.length < 10 || Loading}
        className="mt-3 bg-blue-600 flex gap-3 disabled:bg-blue-300 text-white px-5 py-2 rounded-md"
      >
        <CircularProgress
          size={20}
          sx={{ display: Loading ? "block" : "none" }}
        />
        Submit Review
      </button>
    </div>
  );
};

export default WriteReview;
