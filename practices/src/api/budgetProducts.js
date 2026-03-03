import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { app } from "../firebaseConfig";

const db = getFirestore(app);

export const getFilteredProducts = async ({
  maxPrice,
  category,
  sort,
  lastDoc,
}) => {
  let q = collection(db, "products");

  const constraints = [];

  if (category && category !== "all") {
    constraints.push(where("category", "==", category));
  }

  constraints.push(where("price", "<=", Number(maxPrice)));
  constraints.push(orderBy("price", sort));
  constraints.push(limit(10));

  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }

  const finalQuery = query(q, ...constraints);
  const snapshot = await getDocs(finalQuery);

  return {
    products: snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })),
    lastVisible: snapshot.docs[snapshot.docs.length - 1],
  };
};