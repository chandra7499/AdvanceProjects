import {
  getAuth,
  onIdTokenChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const auth = getAuth(app);
const db = getFirestore(app);

//current state of user
export const useAuthListener = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for ANY change in token: login, logout, refresh, expiration
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        return;
      }

      try {
        // Get refreshed token ALWAYS
        const token = await firebaseUser.getIdToken(true);
        const decoded = await firebaseUser.getIdTokenResult();

        // Load user doc
        const userRef = doc(db, "user", firebaseUser.uid);
        const snap = await getDoc(userRef);

        let userData;

        if (!snap.exists()) {
          // auto-create new user
          userData = {
            Name: firebaseUser.displayName || "Unknown",
            Email: firebaseUser.email,
            profile: firebaseUser.photoURL || "",
            role: "user",
            createdAt: new Date().toISOString(),
          };

          await setDoc(userRef, userData);
        } else {
          userData = snap.data();
        }

        // ❗ extra security: do NOT allow admin accounts on user app
        if (["admin", "superadmin"].includes(userData.role)) {
          console.warn("Admin detected → Blocking access to user app");
          await signOut(auth);
          setUser(null);
          return;
        }

        // Update state
        setUser({
          uid: firebaseUser.uid,
          token,
          ...userData,
        });
      } catch (e) {
        console.error(e);
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return user;
};

// Sign up new users
export const signUp = async ({ email, password, role }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const Userexistences = await getDoc(doc(db, "user", user.uid));
    if (Userexistences.exists) {
      return { message: "User already exists" };
    }
    // Store user details in Firestore
    await setDoc(doc(db, "user", user.uid), {
      Email: user.email,
      role: role,
      createdAt: new Date().toISOString(),
    });
    return { user, message: "User registered successfully" };
  } catch (err) {
    const code = err.code.split("/")[1];
    console.log(code);
    if (code === "email-already-in-use") {
      return { invalid: "User already exists" };
    }else if(code === "password-does-not-meet-requirements"){
       return { invalid: "Please enter a strong password" };
    }

    return { invalid: "some technical error", details: err.message };
  }
};

// Login existing users
export const login = async ({ email, password }) => {
  try {
    // Authenticate user
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User Credential:", userCredential);

    const user = userCredential.user;
    const idToken = await user.getIdToken(true);
    Cookies.set("tarzon_client_token", idToken, { expires: 5 }); // store it for 1 day;
    console.log("Authenticated User:", user);

    // Get user details from Firestore
    const userRef = doc(db, "user", user.uid);
    const userDoc = await getDoc(userRef);

    console.log("Firestore Document:", userDoc);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log("User Data:", userData);
      return {
        uid: user.uid,
        userData,
        token: idToken,
        message: "User login successful",
      };
    } else {
      console.error("User not found in Firestore!");
      return { invalid: "Your email or password is invalid" };
    }
  } catch (error) {
    console.error("Login Error:", error.code.split("/")[1]);

    switch (error.code.split("/")[1]) {
      case "user-not-found":
        return { invalid: "Your email was not registered yet" };
      case "invalid-credential":
        return { invalid: "You entered incorrect credentials" };
      default:
        return { invalid: "Your email or password is invalid" };
    }
  }
};

export const forgetPassword = async ({ email }) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { message: "Reset link sent successfully" };
  } catch (err) {
    switch (err.code) {
      case "auth/user-not-found":
        return { invalid: "your email was not registered yet" };
      case "auth/invalid-credential":
        return { invalid: "your enter incorrect credential" };
      default:
        return { invalid: "your email or password  invalid" };
    }
  }
};

export const googleAuth = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userData = await signInWithPopup(auth, provider);
    console.log(userData);
    return userData;
  } catch (err) {
    console.error("Google Login Error:", err.message);
    return { invalid: err.message };
  }
};

export const facebookAuth = async () => {
  try {
    const provider = new FacebookAuthProvider();
    await signInWithPopup(auth, provider);
    return { user: auth.currentUser };
  } catch (err) {
    console.error("fb Login Error:", err.message);
    return { invalid: err.message };
  }
};

export const githubAuth = async () => {
  try {
    const privider = new GithubAuthProvider();
    const userData = await signInWithPopup(auth, privider);
    console.log(userData);
    return userData;
  } catch (err) {
    console.error("Git Error:", err.message);
    return { invalid: err.message };
  }
};

export const logout = async () => {
  try {
    await auth.signOut();
    return { message: "user Logout successfully" };
  } catch (err) {
    return { error: err.message };
  }
};

// export const verifyToken = async () => {
//   const token = Cookies.get("token");
//   if (!token) {
//     console.log("No token found. user not authenticated");
//     return false;
//   }

//   try {
//     const decodedToken = await auth.currentUser.getIdTokenResult();
//     if (new Date(decodedToken.expirationTime) < new Date()) {
//       console.log("Token expire. logging out....");
//       await logout();
//       Cookies.remove("token");
//       return false;
//     }
//     return true;
//   } catch (err) {
//     console.log("Token verifation failed", err);
//     return false;
//   }
// };
