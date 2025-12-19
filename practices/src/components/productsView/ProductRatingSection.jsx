import { lazy, Suspense, useState, useContext } from "react";
const RatingSummary = lazy(() => import("./RatingSummary"));
const WriteReview = lazy(() => import("./writeReview"));
import { useProductRatingReview } from "../../hooks/Product_rating_review";
import { myContext } from "../GlobalStates/contextHooks";
import { PopUps } from "../../components/popUps";
import { Button } from "@mui/material";
const ProductRatingSection = ({ productId, rating, ratingCount}) => {
  const ratings = { 5: 120, 4: 80, 3: 40, 2: 10, 1: 5 };
  const [open, setOpen] = useState(false);
  const { userData, userLogin, loginPopUp } = useContext(myContext);
  const {
    mutate: product_rating_Reviews,
    isPending,
    isSuccess,
  } = useProductRatingReview();

  const useHandleReviewSubmit = (data) => {
    if (!userLogin) {
      setOpen(true);
    } else {
      product_rating_Reviews({
        userId: userData?.uid,
        productId,
        rating: data.rating,
        review: data.review,
      });
    }
  };

  function popUp() {
    if (loginPopUp?.current) {
      loginPopUp.current.showModal();
    }
  }

  return (
    <div className="flex flex-col justify-center items-center md:flex-row gap-10 w-full mt-10">
      <div className="w-full md:w-1/2">
        <Suspense fallback={<div>Loading...</div>}>
          <RatingSummary ratings={ratings} ratingCount={ratingCount} rating={rating} productId={productId} userId={userData?.uid} />
        </Suspense>
      </div>

      <div className="w-full md:w-1/2 ">
        <Suspense fallback={<div>Loading...</div>}>
          <WriteReview
            Loading={isPending}
            success={isSuccess}
            onSubmit={useHandleReviewSubmit}
          />
        </Suspense>
      </div>
      <PopUps open={open} setOpen={setOpen} title="write Review" fullWidth>
        <p className="text-center py-4 text-2xl font-semibold">
          Please login to write a review
        </p>
        <div className="flex justify-end p-3">
          <Button variant="contained" className="w-max" onClick={popUp}>
            Login
          </Button>
        </div>
      </PopUps>
    </div>
  );
};

export default ProductRatingSection;
