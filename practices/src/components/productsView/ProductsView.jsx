import { useLocation, useNavigate } from "react-router-dom";
import { CosButton, Main, RupeeSymbol, DiscountTag } from "../layouts/layouts";
import { useState, useContext, lazy, Suspense, useEffect, useRef } from "react";
import { myContext } from "../GlobalStates/contextHooks";
import Rating from "../Rating";
import { CategoryBar } from "../../components/categorysBar/CategoryBar";
import VerifiedBadge from "../verifiedBadge";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { NumberAnimation, Loading } from "../loading";
import AddToCart from "../features/AddToCart";
import AddToWishList from "../features/AddToWishList";
import { Button, CircularProgress } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
const ShareSocallMedia = lazy(() => import("../features/Sharesocially"));
import SlideOverflow from "../features/SlideOverflow";
import { selectionProducts, getSimilarProducts } from "../../api/getItems";
const SpecsView = lazy(() => import("./SpecsView"));
const FeaturesView = lazy(() => import("./featuresView"));
const MiniCaroselView = lazy(() => import("../carosels/miniCarosels"));
const ProductRatingSection = lazy(() => import("./ProductRatingSection"));
import { useSelection } from "../../functions/searchFunction";
import { RecentlyViewedProducts } from "../../api/postItems";
import { countConverter } from "../../functions/eventHandlingFn";
import { priceFormatter } from "../../functions/eventHandlingFn";
const ProductReviews = lazy(() => import("./productReviews"));

const ProductsView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userLogin, userData, wishList, addressList } = useContext(myContext);

  const [loading, setLoading] = useState(false);
  const [singleProduct, setSingleProduct] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [qty, setQty] = useState(1);
  const [colorSelected, setColorSelected] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [visible, setVisible] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({});
  const [showMore, setShowMore] = useState(false);

  const requestToSimilarProducst = useRef(false); // avoid multiple similar fetch

  const singleProductId = location.pathname.split("/")[2];

  console.log("addressList", addressList);

  useEffect(() => {
    if (!addressList?.length > 0) {
      return;
    }
    const selectedAddress = addressList?.filter(
      (address) => address.deliveryPoint === true
    );
    setDeliveryAddress(selectedAddress[0]);
  }, [addressList]);

  // Fetch single product
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (singleProductId) {
          const data = await selectionProducts(singleProductId);
          setSingleProduct(data);
        }
      } catch (error) {
        console.log("Not data found", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [singleProductId]);

  const verifySingleProducts = Array.isArray(singleProduct?.images);

  // Variants & colors
  const variants = Array.isArray(singleProduct?.variants)
    ? singleProduct.variants
    : [];

  const variantsInStock = variants.filter((v) => v.stock > 0);

  // Default selected color when product/variants change
  useEffect(() => {
    if (variantsInStock.length === 0) return;

    setColorSelected((prev) => {
      if (prev && variantsInStock.some((v) => v.color === prev)) return prev;
      return variantsInStock[0].color;
    });
  }, [singleProductId, singleProduct?.variants]);

  // Selected variant based on color
  useEffect(() => {
    if (!colorSelected || variants.length === 0) {
      setSelectedVariant(null);
      return;
    }
    const match = variants.find((v) => v.color === colorSelected);
    setSelectedVariant(match || null);
  }, [colorSelected, singleProduct?.variants]);

  // Pricing logic based on selected variant
  const basePrice = selectedVariant?.price ?? singleProduct?.price ?? 0;

  const baseMrp =
    selectedVariant?.mrp ?? singleProduct?.mrp ?? singleProduct?.price ?? 0;

  const isDiscountIsActive = singleProduct?.discount?.isActive;
  const discountPercentage = singleProduct?.discount?.percentage ?? 0;

  const finalPrice = isDiscountIsActive
    ? basePrice - (basePrice * discountPercentage) / 100
    : basePrice;

  // Similar products fetch
  const similarCategoryProduct = async () => {
    if (requestToSimilarProducst.current) return;
    setSimilarLoading(true);
    try {
      const data = await getSimilarProducts(
        singleProduct?.category,
        singleProductId
      );
      setSimilarProducts(Array.isArray(data) ? data : data ? [data] : []);
      requestToSimilarProducst.current = true;
    } catch (error) {
      console.log(error.message);
    } finally {
      setSimilarLoading(false);
    }
  };

  const similarProductIsArray = Array.isArray(similarProducts)
    ? similarProducts
    : similarProducts
    ? [similarProducts]
    : [];

  // Recently viewed tracking
  useEffect(() => {
    if (!userData?.uid || !singleProductId) return;

    const interval = setTimeout(() => {
      const obj = {
        productId: singleProductId,
        date: new Date().toISOString(),
      };
      RecentlyViewedProducts(userData.uid, obj);
    }, 8000);

    return () => clearTimeout(interval);
  }, [singleProductId, singleProduct, userData?.uid]);

  const productSelection = useSelection();

  function Navigation(id) {
    requestToSimilarProducst.current = false;
    setSimilarProducts([]);
    setVisible(false);
    productSelection(id, navigate);
  }

  if (
    singleProduct.length === 0 ||
    singleProduct === undefined ||
    singleProduct === null ||
    loading
  ) {
    return <Loading />;
  }

  function Navigate() {
    const passIngProduct = [
      {
        id: singleProductId,
        name: singleProduct.name,
        price: basePrice * qty,
        quantity: Number(qty),
        color: colorSelected,
        image: Array.isArray(singleProduct.images)
          ? singleProduct.images[0]
          : singleProduct.images,
      },
    ];
    navigate("/delivery-details", {
      state: { products: passIngProduct, section: "singleProduct" },
    });
  }

  function showMoreDescription() {
    setShowMore((prev) => !prev);
  }

  return (
    <>
      <CategoryBar />

      <Main className="flex flex-col scroll-smooth gap-6 p-3">
        {/* Top section: Image + Info */}
        <div className="flex gap-8 relative w-full flex-col items-center md:flex-row">
          {/* Images */}
          <section className="flex w-full md:w-1/2  aspect-auto flex-col items-center">
            {verifySingleProducts ? (
              <MiniCaroselView data={singleProduct?.images} />
            ) : (
              <img
                src={singleProduct?.images}
                alt={singleProduct?.name}
                className="aspect-auto w-full mt-4 h-full object-contain"
              />
            )}
          </section>

          <section className="flex flex-col m-2 w-full md:w-[75%] h-full">
            {/* Social Sharing + Wishlist */}
            <div className="flex w-full  top-0 gap-5 items-center justify-end">
              <Suspense
                fallback={
                  <CircularProgress
                    size={60}
                    sx={{
                      marginLeft: "auto",
                      marginRight: "auto",
                      color: "#0c4a6e",
                    }}
                  />
                }
              >
                <ShareSocallMedia
                  url={window.location.href}
                  title={singleProduct?.name}
                  image={
                    verifySingleProducts
                      ? singleProduct?.images[0]
                      : singleProduct?.images
                  }
                />
              </Suspense>
              <AddToWishList
                product={{ id: singleProductId }}
                wishList={wishList}
                userLogin={userLogin}
                userData={userData}
              />
            </div>

            {/* Product Info */}
            <section className="flex flex-col justify-between p-2 font-sans gap-4 w-full h-full text-base">
              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-semibold leading-snug">
                {singleProduct?.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <Rating
                  size={"small"}
                  value={singleProduct?.rating?.toFixed(1)}
                  color={"#013858FF"}
                />
                {singleProduct?.rating && (
                  <span className="text-sm text-gray-600">
                    {singleProduct?.rating?.toFixed
                      ? singleProduct?.rating?.toFixed(1)
                      : singleProduct?.rating}{" "}
                    / 5
                  </span>
                )}
                {singleProduct?.ratingCount && (
                  <span className="text-sm font-medium  text-gray-700">
                    [{countConverter(singleProduct?.ratingCount)}]
                  </span>
                )}
              </div>

              {/* Variant selection – premium style (B) */}
              {variantsInStock.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-700 font-medium">
                    Choose Color & Price
                  </p>
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {variantsInStock.map((variant) => (
                      <button
                        key={variant.color}
                        onClick={() => setColorSelected(variant.color)}
                        className={`min-w-[8rem] flex flex-col items-start justify-between rounded-xl border px-3 py-2 text-sm transition
                        ${
                          colorSelected === variant.color
                            ? "border-sky-700 bg-sky-50 shadow-sm"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        <span className="font-semibold">{variant.color}</span>
                        <span className="flex items-center gap-1 text-gray-800 font-medium">
                          <RupeeSymbol size="1rem" />
                          {priceFormatter(variant.price)}
                        </span>
                        {variant.mrp && variant.mrp > variant.price && (
                          <span className="text-[0.7rem] text-gray-500 line-through flex items-center gap-1">
                            <RupeeSymbol size="0.8rem" />
                            {variant.mrp}
                          </span>
                        )}
                        {variant.stock <= 3 && (
                          <span className="text-[0.7rem] text-red-500 mt-1">
                            Only {variant.stock} left
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/*storage models */}
              <section className="">
                <span className="font-semibold">Storage:</span>
              </section>

              {/*Delivery Address*/}
              {deliveryAddress !== null && deliveryAddress !== undefined && (
                <section className="flex  gap-2 flex-col">
                  <span className="font-semibold">Delivery At:</span>
                  <div className="flex flex-col border-2 p-2 w-max rounded-lg bg-gray-200">
                    <span>{deliveryAddress?.state}</span>
                    <span>{deliveryAddress?.landMark}</span>
                    <span>zipcode : {deliveryAddress?.zipcode}</span>
                  </div>
                </section>
              )}

              {/* MRP */}
              {isDiscountIsActive && (
                <span className="flex text-lg items-center gap-2">
                  <span className="font-semibold">M.R.P:</span>
                  <span className="flex items-center gap-1 text-gray-500 line-through">
                    <RupeeSymbol size={"1.1rem"} />
                    {priceFormatter(baseMrp)}
                  </span>
                </span>
              )}

              {/* Final Price */}
              <span className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <span className="flex items-center">
                  <RupeeSymbol size={"1.6rem"} />
                  <NumberAnimation
                    value={Math.round(finalPrice * qty * 100) / 100}
                    color={"#000000"}
                    size={"1.6rem"}
                  />
                </span>
                {isDiscountIsActive && (
                  <DiscountTag discount={discountPercentage} />
                )}
              </span>

              {/* Verified */}
              {singleProduct?.verified && <VerifiedBadge />}

              {/* Qty & Actions */}
              <div className="flex flex-col gap-3 mt-3">
                {/* Qty */}
                <div className="inline-flex items-center gap-2">
                  <span className="font-medium">Qty:</span>
                  <select
                    name="Qty"
                    className="outline-none border border-slate-300 rounded-md px-2 py-1 text-sm"
                    id="qty"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Buttons */}
                {!singleProduct?.comingsoon && (
                  <div className="flex gap-3 flex-wrap items-center lg:justify-end justify-between">
                    <AddToCart
                      product={{ id: singleProductId, color: colorSelected }}
                      userLogin={userLogin}
                      userData={userData}
                      type={"btn"}
                    />
                    <CosButton
                      disabled={singleProduct?.stock === 0 || !userLogin}
                      variant="contained"
                      sx={{
                        backgroundColor: "#0c4a6e",
                        fontSize: { xs: "0.8rem", md: "1rem" },
                      }}
                      onClick={Navigate}
                    >
                      Buy Now
                    </CosButton>
                  </div>
                )}
                {singleProduct?.comingsoon && (
                  <div className="flex justify-end">
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "black",
                        fontSize: { xs: "0.8rem", md: "1rem" },
                      }}
                    >
                      Notify me
                    </Button>
                  </div>
                )}
              </div>
            </section>
          </section>
        </div>

        <hr className="bg-slate-200" />

        {/* Variants block display */}
        <h1 className="flex font-bold px-3 text-2xl mt-2">Variants</h1>
        <section className="flex w-full py-2 pl-3 overflow-x-auto">
          <div className="flex gap-4">
            {variants?.map((variant, i) => (
              <div
                key={i}
                className="bg-gray-300 rounded-lg shadow-sm w-max px-4 py-2 text-sm"
              >
                {Object.entries(variant)
                  .sort((a, b) => a[0].localeCompare(b[0]))
                  ?.map(([key, value]) => {
                    if (key === "stock") {
                      return (
                        <div
                          key={key}
                          className="flex px-1 py-0.5 text-sm font-medium"
                        >
                          {value > 0 ? (
                            <span className="text-green-700">In Stock</span>
                          ) : (
                            <span className="text-red-700">Out of Stock</span>
                          )}
                        </div>
                      );
                    }
                    return (
                      <div
                        key={key}
                        className="flex px-1 py-0.5 text-sm font-medium gap-2"
                      >
                        <span className="capitalize text-gray-600">{key}:</span>
                        <span className="text-gray-900">
                          {key === "price" ? priceFormatter(value) : value}
                        </span>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </section>

        <hr className="bg-slate-200" />

        {/* Similar products trigger */}
        <section className="flex flex-col-reverse gap-5 md:px-6 w-full items-center md:flex-row">
          <div className="ml-0 relative text-xl font-serif flex-1 text-nowrap">
            <div
              onClick={() => {
                setVisible((prev) => !prev);
                if (!requestToSimilarProducst.current) {
                  similarCategoryProduct();
                }
              }}
              className="flex items-center gap-2 px-3 shadow-inner shadow-slate-300 rounded-lg py-1 cursor-pointer w-max bg-white"
            >
              <p>Similar Products</p>
              <ArrowDropDownIcon />
            </div>
          </div>

          {/* Add to cart and buy now button already above, so here we keep clean */}
        </section>

        {/* Similar products display */}
        <div className="flex w-full justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ height: 0 }}
              animate={visible ? { height: "max-content" } : { height: 0 }}
              transition={{ duration: 0.4, type: "spring", damping: 22 }}
              exit={{ height: 0 }}
              className="flex justify-center w-full max-w-[80rem] relative items-center gap-6 overflow-hidden justify-self-center"
            >
              <SlideOverflow>
                {similarProductIsArray?.length === 0 && similarLoading ? (
                  <CircularProgress />
                ) : similarProductIsArray?.length > 0 ? (
                  similarProducts?.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 border rounded-lg border-gray-200 p-4 flex-shrink-0 cursor-pointer h-auto items-center w-[12rem] bg-white"
                    >
                      <p className="text-sm w-full font-medium line-clamp-2">
                        {item.name}
                      </p>
                      <img
                        src={
                          Array.isArray(item.image) ? item.image[0] : item.image
                        }
                        alt={item.name}
                        className="w-[10rem] h-[9rem] object-contain"
                        onClick={() => Navigation(item.id)}
                      />
                      <Rating
                        size="small"
                        value={item?.rating}
                        color={"#002067FF"}
                      />
                      <p className="text-md font-sans flex items-center gap-1">
                        Price:
                        <RupeeSymbol />
                        {item.price}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-md font-bold text-2xl py-4">
                    No Similar Products Found
                  </p>
                )}
              </SlideOverflow>
            </motion.div>
          </AnimatePresence>
        </div>

        <hr className="bg-slate-200" />

        {/* Product description */}
        <div className="des flex transition duration-150 ease-in-out flex-col gap-3 px-3">
          <h2 className="text-2xl font-bold">Description</h2>
          <section className="font-serif md:px-4 relative md:text-lg  text-gray-800 leading-relaxed">
            <motion.p
              initial={false}
              animate={{ height: showMore ? "auto" : "4.5em" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              {singleProduct?.description}
            </motion.p>
            <div className={`backdrop-blur-sm rounded-md w-full ${showMore ? "h-1" : "h-8"} flex justify-center absolute bottom-0`}>
              <CosButton
                variant="contained"
                sx={{
                  backgroundColor: "#0c4a6e",
                  color: "white",
                  fontSize: "0.6rem",
                  marginTop:"25px"
                }}
                onClick={()=>showMoreDescription()}
                className="text-indigo-600"
              >
                {!showMore ? `show more` : "show less"}
              </CosButton>
            </div>
          </section>
        </div>

        <hr className="bg-slate-200" />

        {/* Specifications */}
        <section className="flex w-full flex-col lg:px-3 gap-4">
          <h2 className="text-2xl font-bold">Specifications</h2>
          <Suspense
            fallback={<CircularProgress size={60} sx={{ color: "#043958" }} />}
          >
            <SpecsView data={singleProduct?.specifications} />
          </Suspense>
        </section>

        <hr className="bg-slate-200" />

        {/* Features */}
        <section className="flex w-full flex-col lg:px-3 gap-4">
          <h2 className="text-2xl font-bold">Features</h2>
          <Suspense
            fallback={<CircularProgress size={60} sx={{ color: "#043958" }} />}
          >
            <FeaturesView data={singleProduct?.features} />
          </Suspense>
        </section>

        {/* Banners */}
        <section className="flex w-full flex-col lg:px-3 gap-4">
          <div className="relative w-full h-[20rem] md:h-[24rem] lg:h-[28rem] rounded-lg overflow-hidden">
            {/* Sponsored Label */}
            <div className="absolute right-0 bg-black/60 px-4 py-2 rounded-md text-white font-bold text-xl z-20">
              Sponsored
            </div>

            {/* Banner Image with L-shaped cut */}
            <img
              src={singleProduct?.brand?.Banner}
              alt="Brand Banner"
              className="w-full h-full object-fill aspect-auto"
              style={{
                WebkitMask:
                  "linear-gradient(#000 0 0) top left," +
                  "linear-gradient(#000 0 0) top right/135px 45px no-repeat",
                maskComposite: "exclude",
                WebkitMaskComposite: "xor",
              }}
            />
          </div>
        </section>

        {/* Reviews & Rating */}
        <hr className="bg-slate-200" />
        <h2 className="flex text-black w-full text-2xl font-bold pl-3">
          Rating & Reviews
        </h2>
        <section className="flex w-full px-3 pb-6">
          <Suspense fallback={<div>Loading...</div>}>
            <ProductRatingSection
              productId={singleProductId}
              rating={singleProduct?.rating}
              ratingCount={singleProduct?.ratingCount}
            />
          </Suspense>
        </section>
        <section>
          <Suspense fallback={<div>Loading...</div>}>
            <ProductReviews
              productId={singleProductId}
              currentUser={userData}
            />
          </Suspense>
        </section>
      </Main>
    </>
  );
};

export default ProductsView;
