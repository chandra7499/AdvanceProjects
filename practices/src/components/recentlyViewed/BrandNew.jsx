import AppContent from "../AppContent/AppContent";
import { useState, useEffect } from "react";
import { BrandNewProducts } from "../../api/getItems";
const BrandNew = ({ wishList, userLogin, userData }) => {
  const [displayProduct, setDisplayProduct] = useState([]);
  const [productsPending, setProductsPending] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await BrandNewProducts();
      setDisplayProduct(products || []);
      console.log("BrandNew", displayProduct);
      setProductsPending(true);
    };
    fetchProducts();
  }, []);
  return (
    <>
      <AppContent
        displayProduct={displayProduct}
        productsPending={productsPending}
        wishList={wishList}
        userLogin={userLogin}
        userData={userData}
      />
    </>
  );
};

export default BrandNew;
