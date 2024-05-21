const axios = require("axios");
const config = require("../consts/consts");

let cashInConfig = null;
let cashOutNaturalConfig = null;
let cashOutLegalConfig = null;

/**
 * Fetch cash in configuration from API
 * @returns {Promise<Object>} - Cash in configuration
 */
const fetchCashInConfig = async () => {
  if (cashInConfig) return cashInConfig;

  try {
    const response = await axios.get(config.CASH_IN_API_URL);
    cashInConfig = {
      percents: response.data.percents / 100,
      max: response.data.max.amount,
    };
    return cashInConfig;
  } catch (error) {
    console.error("Error fetching cash in config: ", error);
    throw error;
  }
};

/**
 * Fetch cash out natural configuration from API
 * @returns {Promise<Object>} - Cash out natural configuration
 */
const fetchCashOutNaturalConfig = async () => {
  if (cashOutNaturalConfig) return cashOutNaturalConfig;

  try {
    const response = await axios.get(config.CASH_OUT_NATURAL_API_URL);
    cashOutNaturalConfig = {
      percents: response.data.percents / 100,
      weekLimit: response.data.week_limit.amount,
    };
    return cashOutNaturalConfig;
  } catch (error) {
    console.error("Error fetching cash out natural config: ", error);
    throw error;
  }
};

/**
 * Fetch cash out legal configuration from API
 * @returns {Promise<Object>} - Cash out legal configuration
 */
const fetchCashOutLegalConfig = async () => {
  if (cashOutLegalConfig) return cashOutLegalConfig;

  try {
    const response = await axios.get(config.CASH_OUT_LEGAL_API_URL);
    cashOutLegalConfig = {
      percents: response.data.percents / 100,
      min: response.data.min.amount,
    };
    return cashOutLegalConfig;
  } catch (error) {
    console.error("Error fetching cash out legal config: ", error);
    throw error;
  }
};

/**
 * Fetch free amount left for the user in the current week
 * @param {number} userWeeklyCashOut - The total amount of cash out operations for the user in the current week
 * @returns {Promise<number>} - Free amount left for the user
 */
const fetchFreeAmountLeft = async (userWeeklyCashOut) => {
  const configCashOutNatural = await fetchCashOutNaturalConfig();
  return Math.max(configCashOutNatural.weekLimit - userWeeklyCashOut, 0);
};

module.exports = {
  fetchCashInConfig,
  fetchCashOutNaturalConfig,
  fetchCashOutLegalConfig,
  fetchFreeAmountLeft,
};
