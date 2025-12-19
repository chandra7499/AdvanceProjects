import { useCallback, useMemo } from "react";
import { useAddToWishList } from "../../hooks/wishListFn";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { HeartAnimation } from "../../components/loading";
import { tooltipClasses } from "@mui/material/Tooltip";
import { TitleToolTip } from "../../components/layouts/layouts";

const AddToWishList = ({ userLogin, wishList, userData,product}) => {
  const { mutate: addToWishList, isPending } = useAddToWishList();
  const wishListItems = useMemo(
    () => new Set(wishList?.map((item) => item.id)),
    [wishList]
  );

  const handleWishList = useCallback(
    (details) => {
      if (!details) return;
      const ProductsDetails = {
        id: details?.id,
        added:true,
      };

      addToWishList({ userId: userData?.uid, productId: ProductsDetails });
    },
    [addToWishList, userData?.uid]
  );

  if (userLogin && wishList === null) return null;

  return (
    <div>
      {userLogin && (
        <div
          className="wishlist relative  cursor-pointer rounded-full"
          onClick={() => handleWishList(product)}
        >
          <TitleToolTip
            title="add to wishlist"
            placement="bottom"
            disableInteractive
            enterDelay={500}
            sx={{
              [`& .${tooltipClasses.tooltip}`]: {
                fontSize: "10px",
              },
            }}
          >
            {!wishListItems.has(product?.id) && (
              <FavoriteBorderIcon
                sx={{
                  fontSize: { xs: "29px", md: "33px" },
                  "&:hover": { color: "black" },
                  color: "gray",
                }}
              />
            )}

            {wishListItems.has(product?.id) && (
              <FavoriteIcon
                sx={{ fontSize: { xs: "29px", md: "33px" }, color: "black" }}
                className={`${isPending && "animate-plus"}`}
              />
            )}
            {wishListItems.has(product?.id) && <HeartAnimation size={"49px"} />}
          </TitleToolTip>
        </div>
      )}
    </div>
  );
};

export default AddToWishList;
