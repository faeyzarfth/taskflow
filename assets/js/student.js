import { db } from './firebase-config.js';
import { 
    collection, 
    query, 
    where, 
    onSnapshot, 
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

/**
 * Gets real-time updates for assignments targeted to the student's class.
 * @param {string} studentClass - The class of the student (e.g., "9A").
 * @param {function} callback - Function to handle the assignment data.
 * @returns {function} - Unsubscribe function for the listener.
 */
export function getAssignments(studentClass, callback) {
    const q = query(collection(db, "assignments"), where("targetClass", "==", studentClass));
    return onSnapshot(q, (querySnapshot) => {
        const assignments = [];
        querySnapshot.forEach((doc) => {
            assignments.push({ id: doc.id, ...doc.data() });
        });
        callback(assignments);
    });
}

/**
 * Gets real-time updates for a student's submissions.
 * @param {string} userId - The UID of the student.
 * @param {function} callback - Function to handle the submission data.
 * @returns {function} - Unsubscribe function for the listener.
 */
export function getSubmissions(userId, callback) {
    const q = query(collection(db, "submissions"), where("userId", "==", userId));
    return onSnapshot(q, (querySnapshot) => {
        const submissions = [];
        querySnapshot.forEach((doc) => {
            submissions.push({ id: doc.id, ...doc.data() });
        });
        callback(submissions);
    });
}

/**
 * Submits an assignment link.
 * @param {object} submissionData - { assignmentId, userId, link, notes }
 * @returns {Promise}
 */
export function submitAssignment(submissionData) {
    return addDoc(collection(db, "submissions"), {
        ...submissionData,
        submittedAt: serverTimestamp()
    });
}
