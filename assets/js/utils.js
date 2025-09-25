// Utility functions

/**
 * Formats a Firestore Timestamp or a Date object into a readable Indonesian date string.
 * @param {object|Date} timestamp - The Firestore Timestamp or Date object.
 * @returns {string} - Formatted date string (e.g., "25/09/2025").
 */
export function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Validates if a string is a valid URL.
 * @param {string} urlString - The string to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
export function isValidUrl(urlString) {
    try {
        new URL(urlString);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Shows a Bootstrap toast notification.
 * @param {string} message - The message to display.
 * @param {string} type - 'success' or 'error'.
 */
export function showAppToast(message, type = 'success') {
    const toastEl = document.getElementById('appToast');
    const app = window.app; // Access the global Vue app instance

    if (type === 'success') {
        app.toast.title = 'Berhasil';
        app.toast.icon = 'bi-check-circle-fill text-success';
    } else {
        app.toast.title = 'Gagal';
        app.toast.icon = 'bi-x-circle-fill text-danger';
    }
    app.toast.message = message;
    
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}
