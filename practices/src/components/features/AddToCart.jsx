import { useCallback } from "react";
import { useCartProducts } from "../../hooks/useItems";
import { CircularProgress } from "@mui/material";
import { CosButton, TitleToolTip } from "../layouts/layouts";
import { tooltipClasses } from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";

const AddToCart = ({ userData,product,userLogin,type="plus"}) => {
  const {
    mutate: addTocart,
    isPending: pending,
    variables,
  } = useCartProducts();


  const handleCart = useCallback(
    (products) => {
      const updateProducts = {
        id: products.id,
        qty: 1,
      };
      addTocart({ cartItems: updateProducts, userId: userData?.uid });
    },
    [addTocart, userData?.uid]
  );

  return (
    <div className="flex ">

      {userLogin && type === "plus" ?(
        (pending && variables?.cartItems.id === product.id ? (
          <CircularProgress size={29} className="ml-auto mr-0" />
        ) : (
          <TitleToolTip
            title="add to cart"
            placement="bottom"
            disableInteractive
            enterDelay={1000}
            sx={{
              [`& .${tooltipClasses.tooltip}`]: {
                fontSize: "10px",
              },
            }}
          >
            <AddIcon
              onClick={() => handleCart(product)}
              sx={{
                marginLeft: "auto",
                marginRight: "0",
                borderRadius: "50%",
                padding: "5px",
                fontSize: { xs: "29px", md: "33px" },
                color: "gray",
              }}
              type="button"
              className="shadow-inner shadow-slate-950 cursor-pointer  hover:text-slate-900"
            />
          </TitleToolTip>)
        )):(type!=="plus") && (<CosButton onClick={() => handleCart(product)} disabled={pending || !userLogin} loading={pending} loadingPosition="start"  sx={{backgroundColor:"#013068FF",fontSize:{xs:"0.7rem",md:"1rem"}}} variant="contained">Add to cart</CosButton>)}
          
          
    
    </div>
  );
};

export default AddToCart;
