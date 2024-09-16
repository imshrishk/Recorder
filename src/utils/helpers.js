// src/utils/helpers.js

/**
 * Generates a unique filename using the current timestamp and a random number.
 *
 * @param {string} mode - The recording mode to include in the filename.
 * @returns {string} - A unique filename.
 */
export const generateUniqueFilename = (mode) => {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1e9);
  return `${mode}-recording-${timestamp}-${randomNum}.webm`;
};

/**
 * Centralized error handler for logging and displaying errors.
 *
 * @param {Error} error - The error object.
 */
export const handleError = (error) => {
  console.error('An error occurred:', error);
  alert(`An error occurred: ${error.message || error}`);
};