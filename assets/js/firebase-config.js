// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvrReO-C31hWc0w3OniTjJ-s0N0n9cPy8",
  authDomain: "ict-taskflow.firebaseapp.com",
  databaseURL: "https://ict-taskflow-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ict-taskflow",
  storageBucket: "ict-taskflow.appspot.com",
  messagingSenderId: "546834422831",
  appId: "1:546834422831:web:53d11b2e126d138bf1fada",
  measurementId: "G-JC52GWE4LQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export instances
export { db, auth };
