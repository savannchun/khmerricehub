import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const AuthContext = createContext(null);

const STORAGE_KEY = "krh_demo_user";

function userFromFirebase(firebaseUser) {
  if (!firebaseUser) return null;
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "KhmerRiceHub user",
    photoURL: firebaseUser.photoURL,
    role: "buyer",
    demo: false,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [initializing, setInitializing] = useState(true);

  // Keep Firebase Auth in sync with React state.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setInitializing(true);
      if (firebaseUser) {
        try {
          const profile = await getDoc(doc(db, "users", firebaseUser.uid));
          const data = profile.exists() ? profile.data() : {};
          setUser({
            ...userFromFirebase(firebaseUser),
            name: data.name || userFromFirebase(firebaseUser).name,
            role: data.role || "buyer",
            phone: data.phone || "",
          });
        } catch {
          setUser(userFromFirebase(firebaseUser));
        }
      } else if (!localStorage.getItem(STORAGE_KEY)) {
        setUser(null);
      }
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user?.demo) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } catch {
        /* storage unavailable */
      }
    } else {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* storage unavailable */
      }
    }
  }, [user]);

  const persistProfile = async (firebaseUser, profile) => {
    try {
      await setDoc(
        doc(db, "users", firebaseUser.uid),
        { email: firebaseUser.email, ...profile, updatedAt: new Date().toISOString() },
        { merge: true },
      );
    } catch (err) {
      console.warn("[auth] Could not save user profile to Firestore (rules may block writes).", err);
    }
  };

  const login = async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return userFromFirebase(credential.user);
  };

  const register = async ({ name, email, phone, password, role }) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    await persistProfile(credential.user, { name, phone, role });
    setUser({
      uid: credential.user.uid,
      email,
      name,
      phone,
      role,
      demo: false,
    });
    return user;
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    await persistProfile(credential.user, {
      name: credential.user.displayName,
      role: "buyer",
    });
    return userFromFirebase(credential.user);
  };

  // Works offline / without Firebase Auth enabled — useful for demos.
  const demoLogin = (role, name) => {
    const demoUser = {
      uid: `demo-${Date.now()}`,
      email:
        role === "admin"
          ? "admin@khmerricehub.com"
          : role === "farmer"
            ? "sokha@sokhafarm.com"
            : "dara@buyer.com",
      name,
      role,
      demo: true,
    };
    setUser(demoUser);
    return demoUser;
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      /* no firebase session */
    }
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, initializing, login, register, googleSignIn, demoLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
