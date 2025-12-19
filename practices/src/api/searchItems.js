import {
  getFirestore,
  collection,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import algoliasearch from "algoliasearch";
import { app } from "../firebaseConfig";
import axios from "axios";
const api_url = import.meta.env.VITE_API_BASE_URL;
const db = getFirestore(app);

const client = algoliasearch("JZ5M0HIHE7", "78f87d7ebf5f0cd66b9853c02baa5c2b");
const index = client.initIndex("products");

export const selectionData = async (selectionName) => {
  const productsList = collection(db, "products");
  const productsbyName = query(
    productsList,
    where("name", "==", selectionName)
  );
  const [productsbyNameSnap] = await Promise.all([getDocs(productsbyName)]);
  const selectedProducts = [...productsbyNameSnap.docs].map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log(selectedProducts);
  return selectedProducts;
};

async function productsAddingFunction() {
  //it is important for add products into algolia
  const productsList = collection(db, "products");
  const snapShorts = await getDocs(productsList);
  console.log(snapShorts);
  const product = snapShorts.docs.map((item) => {
    const data = item.data();
    return {
      objectID: item.id,
      id: item.id,
      name: data.name,
      category: data.category,
      price: data.price,
      image: data.image,
      rating: data.rating,
      tags: data.tags,
      description: data.description,
    };
  });
  if (product.length > 0) {
    await index.saveObjects(product);
    console.log("Products are synced to Algolia!");
  } else {
    console.log("No products found in Firebase.");
  }
}

export const selectionRandomData = async (selectionName) => {
  // await productsAddingFunction();
  try {
    console.log(selectionName);
    const searchSelection = await axios.get(`${api_url}/uploads/search`, {
      params: { q: selectionName },
    });
    const selectedProducts = searchSelection.data.results;
    // const startText = selectionName.trim().split(" ");
    // const endText = startText + "\uf8ff"; //upper range for unicode
    // const productsbyName = startText.filter((items)=>items!=="").map((item)=>query(productsList,where("name", ">=", item),where("name", "<=", endText)));
    // const productsbyCategory = startText.filter((items)=>items!=="").map((item)=>query(productsList,where("category", ">=", item),where("category", "<=", endText)));
    // const productsbyPrice = startText.filter((items)=>items!=="").map((item)=>query(productsList,where("price", ">=", parseFloat(item)),where("price", "<=", endText)));

    // const [productsbyNameSnap,productsbyCategorySnap,productsbyPriceSnap] = await Promise.all([getDocs(...productsbyName),getDocs(...productsbyCategory),getDocs(...productsbyPrice)]);
    // const selectedProducts = [...productsbyNameSnap.docs,...productsbyCategorySnap.docs,...productsbyPriceSnap.docs].map((doc) => ({
    //   id: doc.id,
    //   ...doc.data(),
    // }));
    console.log(selectedProducts);
    return selectedProducts;
  } catch (e) {
    console.log("search error", e.message);
    return [];
  }
};
