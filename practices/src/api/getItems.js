import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  query,
  getDoc,
  getDocs,
  where,
  limit,
  orderBy,
} from "firebase/firestore";
import { app } from "../firebaseConfig";
import { useState, useEffect, useRef } from "react";
const db = getFirestore(app);

export const useRealTimeProducts = () => {
  const [products, setProducts] = useState();
  const [productsPending, setProductsPending] = useState(false);
  useEffect(() => {
    const productsCollection = collection(db, "products");
    const productQuery = query(
      productsCollection,
      where("rating", ">", 3.9),
      limit(15)
    );
    const unSubscribe = onSnapshot(productQuery, (snapShot) => {
      const productsList = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProductsPending(true);
      setProducts(productsList);
    });

    return () => unSubscribe();
  }, []);

  return { products, productsPending };
};

// total products content

export const useWishListProducts = (userId) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const productsCollection = collection(db, "products");
    const wishlistDoc = doc(db, "user", userId);

    let allProducts = [];
    let wishlistIds = [];

    const updateFiltered = () => {
      if (allProducts?.length && wishlistIds?.length) {
        const wishList = wishlistIds?.map((p) => p.id);
        const filtered = allProducts?.filter((p) => wishList?.includes(p.id));
        console.log(filtered);
        setProducts(filtered);
      } else {
        setProducts([]);
      }
    };

    const unsubProducts = onSnapshot(productsCollection, (snapShot) => {
      allProducts = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(allProducts);
      updateFiltered();
    });

    const unsubWishlist = onSnapshot(wishlistDoc, (snapShot) => {
      wishlistIds = snapShot.data()?.wishlist ?? [];
      console.log("wishlistIds:", wishlistIds);
      updateFiltered();
    });

    return () => {
      unsubProducts();
      unsubWishlist();
    };
  }, [userId]);

  // to debug correctly:
  useEffect(() => {
    console.log("Final filtered products:", products);
  }, [products]);

  return { products };
};

export const useFilterByCategory = (category) => {
  const [products, setProducts] = useState();
  useEffect(() => {
    if (!category) return;
    const productsCollection = collection(db, "products");
    const productQuery = query(
      productsCollection,
      where("category", "==", String(category))
    );
    const unSubscribe = onSnapshot(productQuery, (snapShot) => {
      const productsList = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("category:", productsList);
      setProducts(productsList);
    });

    return () => unSubscribe();
  }, [category]);

  return { products };
};

export const useRealTimeCart = (userId) => {
  const prevRef = useRef(null);
  const [cartList, setCartList] = useState([]);

  useEffect(() => {
    if (!userId || prevRef.current === userId) return;
    prevRef.current = userId;

    let allProducts = [];
    let cartIds = [];

    const updateFilters = () => {
      if (allProducts?.length && cartIds?.length) {
        const mergedCart = cartIds
          .map((cartItem) => {
            const product = allProducts.find((p) => p.id === cartItem.id);
            if (!product) return null;
            const discountPrice =
              product?.price -
              (product?.price * product?.discount?.percentage) / 100;
            const isDiscountIsActive = product?.discount?.isActive;
            const generalPrice = isDiscountIsActive
              ? discountPrice
              : product?.price - product?.discount?.percentage;
            return {
              id: product.id,
              name: product.name,
              price: generalPrice * cartItem.qty,
              image: Array.isArray(product?.images)
                ? product?.images[0]
                : product.image,
              qty: cartItem.qty,
            };
          })
          .filter(Boolean);

        console.log("Cart:", mergedCart);
        setCartList(mergedCart);
      } else {
        setCartList([]);
      }
    };

    const productsCollection = collection(db, "products");
    const cartDoc = doc(db, "user", userId);

    const unSubscribeProducts = onSnapshot(productsCollection, (snapShot) => {
      allProducts = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("allProducts:", allProducts);
      updateFilters();
    });

    const unSubscribeCart = onSnapshot(cartDoc, (doc) => {
      if (doc.exists()) {
        cartIds = doc.data()?.cartData ?? [];
        console.log("cartIds:", cartIds);
        updateFilters();
      } else {
        cartIds = [];
        setCartList([]);
      }
    });

    return () => {
      unSubscribeProducts();
      unSubscribeCart();
    };
  }, [userId]);

  return cartList;
};

export const useRealTimePlaceOrder = (userId) => {
  const prevRef = useRef(null);
  const [placeOrderList, setPlaceOrderList] = useState();
  useEffect(() => {
    if (!userId || prevRef.current === userId) return;
    prevRef.current = userId;
    // console.log(userId);
    const orderItems = doc(db, "user", userId);
    const unSubscribe = onSnapshot(orderItems, (doc) => {
      if (doc.exists()) {
        const placeOrderList = doc.data();
        setPlaceOrderList(placeOrderList?.placeOrders ?? []);
      } else {
        setPlaceOrderList([]);
      }
    });
    return () => unSubscribe();
  }, [userId]);
  return placeOrderList;
};

export const useRealTimeAddresses = (userId) => {
  const prevRef = useRef(null);
  const [addresses, setAddresses] = useState();
  useEffect(() => {
    if (!userId || prevRef.current === userId) return;
    prevRef.current = userId;
    const userData = doc(db, "user", userId);
    const unSubscribe = onSnapshot(userData, (doc) => {
      if (doc.exists()) {
        const addressList = doc.data();
        setAddresses(addressList?.addresses ?? []);
      } else {
        setAddresses([]);
      }
    });
    return () => unSubscribe();
  }, [userId]);
  return addresses;
};

export const useRealTimeCategories = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const allProducts = collection(db, "products");
    const unSubscribe = onSnapshot(allProducts, (snapShot) => {
      const productsList = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const uniqueCategories = [
        ...new Set(productsList.map((p) => p.category)),
      ];
      const uniqueItems = uniqueCategories.map((c) => {
        return {
          category: c,
          image: productsList.find((p) => p.category === c)?.images,
        };
      });

      setCategories(uniqueItems);
    });
    return () => unSubscribe();
  }, []);

  return categories;
};

//pending orders
export const fetchPendingOrders = async ({
  userId,
  filterType = "pending",
}) => {
  if (!userId) return [];

  // 1) get user pending orders
  const userDocRef = doc(db, "user", userId);
  const userSnap = await getDoc(userDocRef);
  if (!userSnap.exists()) return [];

  const userData = userSnap.data() ?? {};
  const pendingOrdersRaw = Array.isArray(userData.pendingOrder)
    ? userData.pendingOrder
    : [];

  // 2) get products (one-time)
  const productsSnap = await getDocs(collection(db, "products"));
  const productsList = productsSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  // 3) filter by status & build the EXACT shape your component expects
  const normalizedOrders = pendingOrdersRaw
    .filter((order) => order?.status === filterType)
    .map((order) => {
      const items = (order.placeOrderList ?? [])
        .map((item) => {
          const product = productsList.find((p) => p.id === item.id);
          if (!product) return null;
          return {
            id: product.id,
            name: product.name,
            image: Array.isArray(product.images) && product.images[0],
            quantity: item.qty || item.quantity,
            itemQtyCost: item.price, // per-item price you stored on the order
             // current product price
          };
        })
        .filter(Boolean);

      return {
        // keep the order identifier your UI uses
        orderId: order.orderId ?? order.id ?? String(order?.createdAt ?? ""),
        cancelledAt: filterType === "cancel" && order?.cancelledAt,
        deliverdAt: filterType === "delivered" && order?.deliverdAt,
        placeOrderList: items,
      };
    });

  return normalizedOrders;
};

export const useOfferzone = () => {
  const [offerdetails, setOfferDetails] = useState([]);
  useEffect(() => {
    const offerCollection = collection(db, "offerZone");
    if (!offerCollection) {
      console.log("no offers are running now");
    }
    const unSubscribe = onSnapshot(offerCollection, (snapshot) => {
      const offerList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOfferDetails(offerList);
    });

    return () => unSubscribe();
  }, []);

  return offerdetails;
};

export const PendingOrders = async (userId) => {
  return new Promise((resolve, reject) => {
    try {
      if (!userId) {
        console.log("userId not found");
      }
      const userDetails = doc(db, "user", userId);
      const unSubscribe = onSnapshot(userDetails, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          const pendingOrders = userData?.pendingOrder ?? [];
          resolve(pendingOrders);
        } else {
          resolve([]);
        }
      });
      return () => unSubscribe();
    } catch (err) {
      reject(err.message);
    }
  });
};

export const PaymentStatus = (userId) => {
  return new Promise((resolve, reject) => {
    try {
      if (!userId) {
        resolve("user not found!");
      }
      const userDetails = doc(db, "user", userId);
      const unSubscribe = onSnapshot(userDetails, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          const paymentStatus = userData?.paymentsStatus ?? [];
          resolve(paymentStatus);
        } else {
          resolve([]);
        }
      });
      return () => unSubscribe();
    } catch (err) {
      reject(err.message);
    }
  });
};

export const useDeliveryStatusPoints = (userId) => {
  const [orderStatusPoints, setOrderStatusPoints] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const userDetails = doc(db, "user", userId);

    const unsubscribe = onSnapshot(
      userDetails,
      (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          const orderStatus = userData?.orderStatus ?? [];
          setOrderStatusPoints(orderStatus);
        } else {
          setOrderStatusPoints([]);
        }
      },
      (err) => {
        console.error("Snapshot error:", err.message);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { orderStatusPoints };
};

export const useTrendingBanners = () => {
  const [trendingBanners, setTrendingBanners] = useState([]);
  useEffect(() => {
    const bannerCollection = collection(db, "TrendingBanners");
    const unSubscribe = onSnapshot(bannerCollection, (snapshot) => {
      const bannerList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTrendingBanners(bannerList);
    });
    return () => unSubscribe();
  }, []);
  return trendingBanners;
};

//search

export const useSearch = (Letters) => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (!Letters || Letters.trim().length === 0) {
      setProducts([]);
      return;
    }
    const productsCollection = collection(db, "products");
    const unSubscribe = onSnapshot(productsCollection, (snapshot) => {
      const productsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const filterProducst = productsList.filter((p) =>
        p.name.toLowerCase().includes(Letters.toLowerCase())
      );
      setProducts(filterProducst);
      console.log("Products:", filterProducst);
      console.log(Letters);
    });

    return () => unSubscribe();
  }, [Letters]);
  return products;
};

export const selectionProducts = async (id) => {
  const productRef = doc(db, "products", id);
  const productSnap = await getDoc(productRef);
  console.log(productSnap.data());
  return productSnap.exists() ? productSnap.data() : null;
};

export const placeOrderSelectionCalculations = async (userId) => {
  try {
    if (!userId) return;
    const userRef = doc(db, "user", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;
    const userData = userSnap.data();
    const placeOrder = userData.placeOrders || [];
    const totalAmount = placeOrder.reduce(
      (total, item) => total + item.price,
      0
    );
    console.log(totalAmount);
    return Number(totalAmount.toFixed(2));
  } catch (error) {
    console.log(error.message);
  }
};

export const calculateRefudableAmount = async (userId, OrderId) => {
  try {
    if (!userId || !OrderId) return;
    const userRef = doc(db, "user", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;
    const userData = userSnap.data();
    const pendingOrder = userData.pendingOrder || [];
    const orderSearching = pendingOrder.find(
      (order) => order.orderId === OrderId
    );
    const totalAmount = orderSearching.placeOrderList.reduce(
      (total, item) => total + item.price,
      0
    );
    //offer zone that get current  gst and deliveryCharges
    const offerZone = collection(db, "offerZone");
    const offerSnap = await getDocs(offerZone);
    const offerList = offerSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(offerList);
    console.log(totalAmount);
    const totalAmountWithOutdeliveryCharges =
      totalAmount - offerList[0]?.deliveryCharges;
    console.log(totalAmountWithOutdeliveryCharges);
    const totalAmountWithOutgst = (totalAmount * offerList[0]?.gst) / 100;
    const finalPrice =
      totalAmountWithOutdeliveryCharges - totalAmountWithOutgst;
    return {
      finalPrice: Number(finalPrice).toFixed(2),
      totalAmount: Number(totalAmount).toFixed(2),
      totalAmountWithOutgst: Number(totalAmountWithOutgst).toFixed(2),
      totalAmountWithdeliveryCharges: Number(
        totalAmountWithOutdeliveryCharges
      ).toFixed(2),
    };
    // return Number(totalAmount.toFixed(2));
  } catch (error) {
    return { errorMessage: error.message };
    //  return {errorMessage:error.message}
  }
};

//get similar products by products view
export const getSimilarProducts = async (category, itemId) => {
  if (!category || !itemId) return;
  try {
    const productsCollection = collection(db, "products");
    const productQuery = query(
      productsCollection,
      where("category", "==", String(category))
    );
    const productSnap = await getDocs(productQuery);
    console.log(productSnap);

    const productsList = productSnap.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((p) => p.id !== itemId);
    return productsList;
  } catch (error) {
    return { errorMessage: error.message };
  }
};

//Popular products
export const useRealTimePopularProducts = (userId) => {
  const [popularCategories, setPopularCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🛒 Real-time data from existing hooks
  const { cartItems } = useRealTimeCart(userId); // could be ["id1", "id2"] or [{id:"id1"}, ...]
  const { wishlistItems } = useWishListProducts(userId);

  useEffect(() => {
    const fetchPopularCategories = async () => {
      try {
        if (!userId) return;
        setLoading(true);

        // 1️⃣ Fetch all products sorted by rating
        const productsCollection = collection(db, "products");
        const productQuery = query(
          productsCollection,
          orderBy("rating", "desc")
        );
        const productSnap = await getDocs(productQuery);

        const products = productSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 2️⃣ Normalize cart + wishlist to simple ID arrays
        const cartIds = (cartItems || []).map((item) =>
          typeof item === "string" ? item : item.id
        );
        const wishlistIds = (wishlistItems || []).map((item) =>
          typeof item === "string" ? item : item.id
        );

        // 3️⃣ Get matching product objects
        const cartProducts = products.filter((p) => cartIds.includes(p.id));
        const wishlistProducts = products.filter((p) =>
          wishlistIds.includes(p.id)
        );

        const cartCategories = cartProducts.map((p) => p.category);
        const wishlistCategories = wishlistProducts.map((p) => p.category);

        // 4️⃣ Group products by category
        const categoryMap = {};
        for (const p of products) {
          const discount =
            p.discount?.isActive && p.discount?.percentage
              ? p.discount.percentage
              : 0;
          const discountPrice = p.price - (p.price * discount) / 100;

          if (!categoryMap[p.category]) categoryMap[p.category] = [];

          categoryMap[p.category].push({
            id: p.id,
            name: p.name,
            price: p.price,
            discount,
            discountPrice: parseFloat(discountPrice.toFixed(2)),
            rating: p.rating,
            ratingCount: p.ratingCount,
            image: Array.isArray(p.image) ? p.image[0] : Array.isArray(p.images) ? p.images[0] : p.image,
          });
        }

        // 5️⃣ Score categories
        const scoredCategories = Object.keys(categoryMap).map((cat) => {
          let score = 0;

          const avgRating =
            categoryMap[cat].reduce((sum, p) => sum + p.rating, 0) /
            categoryMap[cat].length;
          score += avgRating * 10;

          if (cartCategories.includes(cat)) score += 15;
          if (wishlistCategories.includes(cat)) score += 10;

          return {
            categoryName: cat,
            score,
            subProducts: categoryMap[cat],
          };
        });

        // 6️⃣ Sort + limit
        const topCategories = scoredCategories
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);

        setPopularCategories(topCategories);
      } catch (err) {
        console.error("🔥 Error loading popular categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularCategories();
  }, [userId, cartItems, wishlistItems]);

  return { popularCategories, loading };
};

//recently add Products

export const RecentlyView = async (userId) => {
  if (!userId) return;
  try {
    const userRef = doc(db, "user", userId);
   
    const productRef = collection(db, "products");
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;
    const userData = userSnap?.data();
    console.log(userData);
    const recentlyViewed = userData?.recentlyViewedProducts || [];
    console.log(recentlyViewed);

    const productsList = await Promise.all(
      recentlyViewed?.map(async (item) => {
        const productSnap = await getDoc(doc(productRef, item.productId));
        const productData = productSnap.data();
        return {
          id: productSnap.id,
          image:productData.images[0],
          name: productData.name,
          date: item.date,
        };
      })
    );

    console.log(productsList);

    productsList.sort((a, b) => b.date - a.date);
    return productsList;
  } catch (e) {
    console.log("error", e.message);
  }
};

//Brand New

export const BrandNewProducts = async () => {
  try {
    const products  = collection(db, "products");
    const productsList =  query(products, orderBy("createdAt", "desc"),limit(10));
    const productSnap = await getDocs(productsList);
    const recentlyAddedList = productSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    console.log(recentlyAddedList);
    return recentlyAddedList;
  } catch (e) {
    console.log("error", e.message);
  }
};
