import PropTypes from "prop-types";
import { useContext } from "react";
import { myContext } from "../../../components/GlobalStates/contextHooks";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import AddToCart from "../../features/AddToCart";

const BuyAgain = ({ selectedItems }) => {
  const { userData, userLogin } = useContext(myContext);
  // const [loadingProductId, setLoadingProductId] = useState(null);
  // const filterProducts = selectedItems?.filter((product) => {
  //   return displayProduct.some((item) => item.id === product.id);
  // });

  console.log(selectedItems);

  const navigate = useNavigate();

  const handlePurchaseType = (filterType) => {
    navigate("/delivery-details", {
      state: { products: filterType, section: "BuyAgain" },
    });
  };

  // const handleAddToCart = useCallback(
  //   (products) => {
  //     console.log(products);
  //     setLoadingProductId(products.id);
  //     const updateProducts = {
  //       id: products.id,
  //       name: products.name,
  //       price: products.price,
  //       stock: products.stock,
  //       image: products.image,
  //       qty: 1,
  //     };
  //     addTocart(
  //       { cartItems: updateProducts, userId: userData?.uid },
  //       {
  //         onSettled: () => {
  //           setLoadingProductId(null);
  //         },
  //       }
  //     );
  //   },
  //   [addTocart, userData?.uid]
  // );
  return (
    <>
      {selectedItems?.map((item) => (
        <div
          key={item.id}
          className="flex flex-col px-3 justify-center  sm:flex-col xs:px-8 md:py-5 md:px-5 sm:w-[30rem] sm:px-5 gap-3 items-start py-3 shrink-0"
        >
          <div className="flex flex-row xs:flex-col sm:flex-row  gap-2">
            <img
              src={item.image}
              alt={item.name}
              className="w-[250px] h-[250px]"
            />

            <div className="info flex flex-col">
              <p className="font-serif text-xl">{item.name}</p>
              <p className="font-mono">price:{item.price}</p>
              <p>Qty:{item.quantity || item.qty}</p>
              <p>Item X qty:{item.itemQtyCost}</p>
            </div>
          </div>
          <div className="flex flex-row  ml-0 mr-auto">
            <AddToCart
              product={{ id: item.id }}
              userData={userData}
              userLogin={userLogin}
              type={"buyAgain"}
            />
          </div>
        </div>
      ))}
      <div className="flex w-full justify-end p-3">
        <Button
          variant="contained"
          color="success"
          onClick={() => handlePurchaseType(selectedItems)}
          sx={{ fontSize: { xs: "0.5rem", sm: "0.8rem" } }}
        >
          Purchase
        </Button>
      </div>
    </>
  );
};

BuyAgain.propTypes = {
  selectedItems: PropTypes.array.isRequired,
};

export default BuyAgain;
