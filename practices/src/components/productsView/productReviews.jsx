import { useEffect, useState } from "react";
import { getProductReviews } from "../../api/rating_Reviews";
import { useReplayToReview } from "../../hooks/Product_rating_review";
import RatingComp from "../Rating";
import { CircularProgress } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { motion, AnimatePresence } from "framer-motion";

const ProductReviews = ({ productId, currentUser }) => {
  const [reviews, setReviews] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [openReply, setOpenReply] = useState({});
  const [loading, setLoading] = useState(true);

  const { mutate: addReply, isPending } = useReplayToReview();

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    setLoading(true);
    const data = await getProductReviews(productId);

    const toggleState = {};
    data.forEach((r) => (toggleState[r.userId] = false));

    setOpenReply(toggleState);
    setReviews(data);
    setLoading(false);
  };

  console.log(reviews);

  const handleReplySubmit = (reviewUserId) => {
    const text = replyText[reviewUserId];
    if (!text) return;

    const replayObj = {
      userId: currentUser.uid,
      replayText: text,
      repliedBy: currentUser.Name || "Unknown",
      date: new Date().toISOString(),
    };

    addReply(
      {
        userId: reviewUserId,
        currentUserId: currentUser.uid,
        productId,
        replayObj,
      },
      {
        onSuccess: () => {
          setReviews((prev) =>
            prev.map((r) =>
              r.userId === reviewUserId
                ? { ...r, reply: [...(r.reply || []), replayObj] }
                : r
            )
          );

          setReplyText((p) => ({ ...p, [reviewUserId]: "" }));
          setOpenReply((p) => ({ ...p, [reviewUserId]: false }));
        },
      }
    );
  };

  if (loading) return <p className="text-center">Loading reviews...</p>;
  if (reviews.length === 0)
    return <p className="text-gray-600">No reviews yet.</p>;

  return (
    <div className="space-y-5 p-4 bg-white">
      {reviews.map((review) => (
        <div key={review.userId} className="border rounded p-4 shadow-sm">
          <RatingComp size="small" value={review.rating.toFixed(1)} />

          <div className="flex items-center gap-2 mt-2">
            <img src={review.profile} className="w-10 h-10 rounded-full" />
            <h3 className="font-bold">{review.fullName}</h3>
          </div>

          <p className="mt-2 text-gray-700">{review.review}</p>

          {/* Replies */}
          {review?.replay?.length > 0 && (
            <div className="mt-3 ml-5 border-l-4 pl-4 max-h-[25%] overflow-y-scroll space-y-2">
              {review?.replay.map((rep, i) => (
                <div key={i} className="flex flex-col border-2 p-1 rounded-md border-gray-300 gap-3">
                  <div className="flex gap-3 items-center">
                    <img
                      src={rep.profile}
                      alt="profile"
                      className="w-10 h-10 rounded-full "
                    />
                    <p className="text-sm">
                      <span className="font-semibold text-blue-700">
                        {rep.fullName}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-wrap text-wrap p-1">
                    <p className="text-md w-full text-wrap">{rep.replayText}</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(rep.date).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Reply toggle */}
          {review.userId !== currentUser.uid && !review?.replyUserIds?.includes(currentUser.uid) &&  (
            <button
              onClick={() =>
                setOpenReply((p) => ({
                  ...p,
                  [review.userId]: !p[review.userId],
                }))
              }
              className="flex items-center gap-1 mt-3 text-blue-700"
            >
              <ArrowDropDownIcon
                sx={{
                  transform: openReply[review.userId]
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              />
              Reply
            </button>
          )}

          {/* Reply box */}
          <AnimatePresence>
            {openReply[review.userId] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 flex gap-2 overflow-hidden"
              >
                <input
                  className="flex-1 border rounded p-2"
                  placeholder="Write a reply..."
                  value={replyText[review.userId] || ""}
                  onChange={(e) =>
                    setReplyText((p) => ({
                      ...p,
                      [review.userId]: e.target.value,
                    }))
                  }
                />
                <button
                  disabled={!replyText[review.userId] || isPending}
                  onClick={() => handleReplySubmit(review.userId)}
                  className="bg-blue-700 text-white px-4 rounded disabled:opacity-50"
                >
                  {isPending ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    "Reply"
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default ProductReviews;
