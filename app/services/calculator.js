const { roundUp } = require("../helpers/helpers");
const {
  fetchCashInConfig,
  fetchCashOutNaturalConfig,
  fetchCashOutLegalConfig,
} = require("./config");

/**
 * Calculate commission fee for cash in operations
 * @param {number} amount - Operation amount
 * @returns {Promise<number>} - Commission fee
 */
const calculateCashInCommission = async (amount) => {
  const configCashIn = await fetchCashInConfig();
  const commission = amount * configCashIn.percents;
  return roundUp(Math.min(commission, configCashIn.max));
};

/**
 * Calculate commission fee for cash out operations for natural persons
 * @param {number} amount - Operation amount
 * @param {number} freeAmountLeft - Free amount left for the user in the current week
 * @returns {number} - Commission fee
 */
const calculateCashOutCommissionNatural = async (amount, freeAmountLeft) => {
  const configCashOutNatural = await fetchCashOutNaturalConfig();
  const taxableAmount = Math.max(amount - freeAmountLeft, 0);
  const commission = taxableAmount * configCashOutNatural.percents;
  return roundUp(commission);
};

/**
 * Calculate commission fee for cash out operations for legal persons
 * @param {number} amount - Operation amount
 * @returns {number} - Commission fee
 */
const calculateCashOutCommissionLegal = async (amount) => {
  const configCashOutLegal = await fetchCashOutLegalConfig();
  const commission = amount * configCashOutLegal.percents;
  return roundUp(Math.max(commission, configCashOutLegal.min));
};

module.exports = {
  calculateCashInCommission,
  calculateCashOutCommissionNatural,
  calculateCashOutCommissionLegal,
};
