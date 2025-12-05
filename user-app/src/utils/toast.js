// Utility functions for toast notifications
import { toast } from 'react-toastify';

/**
 * Show success toast notification
 * @param {string} message - Success message to display
 */
export const showSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

/**
 * Show error toast notification
 * @param {string} message - Error message to display
 */
export const showError = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

/**
 * Show warning toast notification
 * @param {string} message - Warning message to display
 */
export const showWarning = (message) => {
  toast.warning(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

/**
 * Show info toast notification
 * @param {string} message - Info message to display
 */
export const showInfo = (message) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Default export with all functions
export default {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
};

