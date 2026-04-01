// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { auth, db, googleProvider } from '@/lib/firebase'
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import {
  doc, getDoc, setDoc, updateDoc, collection, getDocs, serverTimestamp,
} from 'firebase/firestore'

// ── Roles ─────────────────────────────────────────────────────────────────────
export const ROLES = {
  CLIENT:   'client',
  OPERATOR: 'operator',
  ADMIN:    'admin',
}

export const ROLE_LABELS = {
  client:   'Cliente',
  operator: 'Operador',
  admin:    'Administrador',
}

export const ROLE_COLORS = {
  client:   'bg-blue-100 text-blue-700',
  operator: 'bg-orange-100 text-orange-700',
  admin:    'bg-red-100 text-red-700',
}

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext({})
export const useAuth = () => useContext(AuthContext)

// ── Provider ──────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user,     setUser]     = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading,  setLoading]  = useState(true)

  // Fetch role from Firestore or create doc for new user
  const fetchOrSetUserRole = async (uid, email, displayName, photoURL) => {
    const ref  = doc(db, 'users', uid)
    const snap = await getDoc(ref)
    if (snap.exists()) {
      setUserRole(snap.data().role)
    } else {
      await setDoc(ref, {
        uid,
        email,
        name:      displayName || '',
        photoURL:  photoURL    || '',
        role:      ROLES.CLIENT,
        createdAt: serverTimestamp(),
      })
      setUserRole(ROLES.CLIENT)
    }
  }

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        await fetchOrSetUserRole(
          currentUser.uid,
          currentUser.email,
          currentUser.displayName,
          currentUser.photoURL,
        )
      } else {
        setUserRole(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  // ── Auth actions ─────────────────────────────────────────────────────────────
  const loginWithGoogle = () => signInWithPopup(auth, googleProvider)

  const loginWithEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  const registerWithEmail = async (name, email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName: name })
    await fetchOrSetUserRole(result.user.uid, email, name, null)
    return result
  }

  const resetPassword = (email) => sendPasswordResetEmail(auth, email)

  const logout = () => signOut(auth)

  // ── Admin actions ─────────────────────────────────────────────────────────────
  const updateUserRole = async (uid, newRole) =>
    updateDoc(doc(db, 'users', uid), { role: newRole })

  const listUsers = async () => {
    const snap = await getDocs(collection(db, 'users'))
    return snap.docs.map(d => d.data())
  }

  // ── Permission shortcuts ──────────────────────────────────────────────────────
  const isAdmin    = userRole === ROLES.ADMIN
  const isOperator = userRole === ROLES.OPERATOR || userRole === ROLES.ADMIN
  const isLoggedIn = !!user

  return (
    <AuthContext.Provider value={{
      user, userRole, loading, isAdmin, isOperator, isLoggedIn,
      loginWithGoogle, loginWithEmail, registerWithEmail,
      resetPassword, logout, updateUserRole, listUsers,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
