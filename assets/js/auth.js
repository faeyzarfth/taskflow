import { db, auth } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

/**
 * Registers a new student user.
 * @param {object} userData - { email, password, fullName, studentClass }
 * @returns {Promise<object>} - The user credential object.
 */
export async function registerStudent({ email, password, fullName, studentClass }) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        fullName: fullName,
        studentClass: studentClass,
        role: "student"
    });

    return userCredential;
}

/**
 * Logs in a user.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<object>} - The user credential object.
 */
export function loginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Logs out the current user.
 * @returns {Promise}
 */
export function logoutUser() {
    return signOut(auth);
}

/**
 * Monitors authentication state changes.
 * @param {function} callback - Function to run when auth state changes.
 */
export function monitorAuthState(callback) {
    onAuthStateChanged(auth, async user => {
        if (user) {
            // User is signed in, get their profile from Firestore
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                callback({ ...user, ...userDocSnap.data() });
            } else {
                // Handle case where user exists in Auth but not Firestore
                console.error("User profile not found in Firestore.");
                callback(null);
            }
        } else {
            // User is signed out
            callback(null);
        }
    });
}
