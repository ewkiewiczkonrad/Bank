/**
 * Helper function to round up numbers to the smallest currency unit (e.g., cents)
 * @param {number} num - Number to round up
 * @returns {number} - Rounded number
 */
const roundUp = (num) => Math.ceil(num * 100) / 100;

/**
 * Helper function to get the week number from a date
 * @param {Date} date - Date object
 * @returns {number} - Week number of the year
 */
const getWeekNumber = (date) => {
  const oneJan = new Date(date.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
  return Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
};

module.exports = { roundUp, getWeekNumber };
