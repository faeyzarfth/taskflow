import { db } from './firebase-config.js';
import { 
    collection, 
    onSnapshot,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

/**
 * Gets real-time updates for all assignments.
 * @param {function} callback 
 * @returns {function} Unsubscribe function.
 */
export function getAllAssignments(callback) {
    const q = collection(db, "assignments");
    return onSnapshot(q, (snapshot) => {
        const assignments = [];
        snapshot.forEach(doc => assignments.push({ id: doc.id, ...doc.data() }));
        callback(assignments);
    });
}

/**
 * Creates a new assignment.
 * @param {object} assignmentData - { title, subject, description, targetClass, deadline }
 * @returns {Promise}
 */
export function createAssignment(assignmentData) {
    return addDoc(collection(db, "assignments"), {
        ...assignmentData,
        createdAt: serverTimestamp()
    });
}

/**
 * Updates an existing assignment.
 * @param {string} id - The document ID of the assignment.
 * @param {object} assignmentData - The data to update.
 * @returns {Promise}
 */
export function updateAssignment(id, assignmentData) {
    const docRef = doc(db, "assignments", id);
    return updateDoc(docRef, assignmentData);
}

/**
 * Deletes an assignment.
 * @param {string} id - The document ID of the assignment.
 * @returns {Promise}
 */
export function deleteAssignment(id) {
    return deleteDoc(doc(db, "assignments", id));
}

// Functions for students and submissions can be added here
