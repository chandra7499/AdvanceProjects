import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDocs,
  collection,
} from "firebase/firestore";
import { app } from "../firebaseConfig";
const db = getFirestore(app);

export const product_rating_Reviews = async (
  userId,
  productId,
  rating,
  review
) => {
  try {
    if (!userId || !productId) {
      return { warning: "userId or productId missing" };
    }

    const ratingRef = doc(db, "Products_rating_Reviews", userId);
    //cross check user already rate this or not before if not pass other wise tello it not allowed to rate again
    const ratingSnap = await getDoc(ratingRef);
    if (ratingSnap.exists()) {
      const data = ratingSnap.data();
      if (data[productId]) {
        return { warning: "You have already rated this product" };
      }
    }

    const dataToSave = {
      [productId]: {
        rating,
        review,
        replay: [],
        date: new Date().toISOString(),
      },
    };

    await setDoc(ratingRef, dataToSave, { merge: true });
    ratingCalculation(userId, productId);

    return { message: "Rating saved successfully" };
  } catch (error) {
    console.log(error.message);
    return { error: error.message };
  }
};

export const ratingCalculation = async (userId, productId) => {
  try {
    if (!userId) {
      return { warning: "userId not found" };
    }
    const ratingRef = collection(db, "Products_rating_Reviews");
    const ratingSnap = await getDocs(ratingRef);
    let total = 0;
    let count = 0;
    ratingSnap.forEach((doc) => {
      const docData = doc.data();
      if (docData[productId] && docData[productId].rating !== null) {
        total += Number(docData[productId].rating);
        count++;
      }
    });
    const average = count > 0 ? total / count : 0;
    //updated this rating in product
    const productRef = doc(db, "products", productId);
    await setDoc(
      productRef,
      { rating: Number(average.toFixed(1)), ratingCount: Number(count) },
      { merge: true }
    );
    console.log(Number(average.toFixed(1)), count);
    return { average: Number(average.toFixed(1)), count };
  } catch (e) {
    console.log(e.message);
  }
};

//individual rating progress
export const ratingProgress = async (userId, productId) => {
  try {
    if (!userId || !productId) {
      return { warning: "userId or productId missing" };
    }
    //like {5 : 120,4:20,3:10,2:10,1:10}
    const ratingRef = collection(db, "Products_rating_Reviews");
    const ratingSnap = await getDocs(ratingRef);
    const ratingList = ratingSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const progress = ratingList.reduce((acc, item) => {
      if (item[productId] && item[productId].rating !== null) {
        acc[item[productId].rating] = (acc[item[productId].rating] || 0) + 1;
      }
      return acc;
    }, {});
    console.log(progress);
    const finalProgress = {
      5: progress[5] || 0,
      4: progress[4] || 0,
      3: progress[3] || 0,
      2: progress[2] || 0,
      1: progress[1] || 0,
    };
    const total =
      finalProgress[5] +
      finalProgress[4] +
      finalProgress[3] +
      finalProgress[2] +
      finalProgress[1];

    finalProgress[5] = (finalProgress[5] / total) * 100;
    finalProgress[4] = (finalProgress[4] / total) * 100;
    finalProgress[3] = (finalProgress[3] / total) * 100;
    finalProgress[2] = (finalProgress[2] / total) * 100;
    finalProgress[1] = (finalProgress[1] / total) * 100;
    return finalProgress;
  } catch (error) {
    console.log(error.message);
    return { error: error.message };
  }
};

export const getProductReviews = async (productId) => {
  const reviewsRef = collection(db, "Products_rating_Reviews");
  const snap = await getDocs(reviewsRef);

  const results = [];

  for (const docSnap of snap.docs) {
    const reviewUserId = docSnap.id;
    const reviewData = docSnap.data()[productId];

    if (!reviewData) continue;

    // 🔹 Reviewer info
    const reviewerSnap = await getDoc(doc(db, "user", reviewUserId));
    const reviewer = reviewerSnap.exists()
      ? {
          fullName: reviewerSnap.data().Name || "Unknown User",
          profile: reviewerSnap.data().profile || "",
        }
      : { fullName: "Unknown User", profile: "" };

    const replies = [];
    const replyUserIdsSet = new Set(); // 🔥 prevents duplicates

    if (Array.isArray(reviewData.replay)) {
      for (const rep of reviewData.replay) {
        replyUserIdsSet.add(rep.userId);

        const replyUserSnap = await getDoc(doc(db, "user", rep.userId));

        replies.push({
          userId: rep.userId,
          replayText: rep.replayText,
          date: rep.date,
          fullName: replyUserSnap.exists()
            ? replyUserSnap.data().Name || "Unknown User"
            : "Unknown User",
          profile: replyUserSnap.exists()
            ? replyUserSnap.data().profile || ""
            : "",
        });
      }
    }

    results.push({
      userId: reviewUserId,
      ...reviewer,
      rating: reviewData.rating,
      review: reviewData.review,
      replay: replies,
      replyUserIds: Array.from(replyUserIdsSet), // ✅ list of ids
    });
  }

  return results;
};


export const addReplayToReview = async (
  userId,
  currentUserId,
  productId,
  replayObj
) => {
  try {
    if (!userId || !productId || !replayObj || !currentUserId) {
      return { warning: "Missing required fields" };
    }

    // Get user review document
    const userRef = doc(db, "Products_rating_Reviews", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { error: "User review document not found" };
    }

    const userData = userSnap.data();

    if (!userData[productId]) {
      return { error: "Product review not found for this user" };
    }

    // Update reply array using arrayUnion
    await updateDoc(userRef, {
      [`${productId}.replay`]: arrayUnion(replayObj),
    });

    return { success: true };
  } catch (e) {
    console.log(e);
    return { error: e.message };
  }
};

export const getReplays = async (userReplayId, productId) => {
  try {
    if (!userReplayId || !productId) {
      return { error: "Missing userReplayId or productId" };
    }

    // ✅ MUST be doc(), not collection()
    const userDocRef = doc(db, "Products_rating_Reviews", userReplayId);
    const snap = await getDoc(userDocRef);

    if (!snap.exists()) {
      return [];
    }

    const data = snap.data();

    // ✅ Safe access
    return data?.[productId]?.replay || [];
  } catch (e) {
    return { error: e.message };
  }
};
