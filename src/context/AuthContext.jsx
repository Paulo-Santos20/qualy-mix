// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, googleProvider } from '@/lib/firebase';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext({});

// 👇 ESTA É A LINHA QUE CORRIGE O SEU ERRO 👇
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null); 
  const [loading, setLoading] = useState(true);

  const fetchOrSetUserRole = async (uid, email, displayName, photoURL) => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setUserRole(userSnap.data().role);
    } else {
      await setDoc(userRef, {
        email,
        name: displayName || '',
        photoURL: photoURL || '',
        role: 'client', 
        createdAt: new Date()
      });
      setUserRole('client');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchOrSetUserRole(currentUser.uid, currentUser.email, currentUser.displayName, currentUser.photoURL);
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const registerWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, userRole, loginWithGoogle, loginWithEmail, registerWithEmail, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};