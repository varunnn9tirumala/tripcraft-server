import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth"

import { auth, db } from "./firebase"

import {
  doc,
  setDoc,
  getDoc
} from "firebase/firestore"

const provider = new GoogleAuthProvider()

/* GOOGLE LOGIN */

export async function loginWithGoogle(){

  const result = await signInWithPopup(auth, provider)

  const user = result.user

  const userRef = doc(db,"users",user.uid)

  const snapshot = await getDoc(userRef)

  /* Create user only if first login */

  if(!snapshot.exists()){

    await setDoc(userRef,{

      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      bookings: 0,
      usedSara: false,
      createdAt: new Date()

    })

  }

  return user
}

/* LOGOUT */

export async function logoutUser(){
  await signOut(auth)
}

/* AUTH STATE LISTENER (keeps login after refresh) */

export function listenAuth(callback:any){
  return onAuthStateChanged(auth,callback)
}