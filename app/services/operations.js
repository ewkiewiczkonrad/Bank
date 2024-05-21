const { getWeekNumber } = require("../helpers/helpers");
const commissionCalculator = require("./calculator");
const { fetchFreeAmountLeft } = require("./config");

/**
 * Process the operations and calculate the commission fees
 * @param {Array} operations - List of operations
 * @returns {Promise<Array>} - List of commission fees
 */
const processOperations = async (operations) => {
  const userWeeklyCashOut = {};

  const results = [];
  for (const operation of operations) {
    const {
      date,
      user_id,
      user_type,
      type,
      operation: { amount, currency },
    } = operation;
    if (currency !== "EUR") throw new Error("Unsupported currency");

    let commission = 0;

    if (type === "cash_in") {
      commission = await commissionCalculator.calculateCashInCommission(amount);
    } else if (type === "cash_out") {
      if (user_type === "natural") {
        const weekNumber = getWeekNumber(new Date(date));
        if (!userWeeklyCashOut[user_id]) userWeeklyCashOut[user_id] = {};
        if (!userWeeklyCashOut[user_id][weekNumber])
          userWeeklyCashOut[user_id][weekNumber] = 0;

        const freeAmountLeft = await fetchFreeAmountLeft(
          userWeeklyCashOut[user_id][weekNumber]
        );
        commission =
          await commissionCalculator.calculateCashOutCommissionNatural(
            amount,
            freeAmountLeft
          );
        userWeeklyCashOut[user_id][weekNumber] += amount;
      } else if (user_type === "juridical") {
        commission = await commissionCalculator.calculateCashOutCommissionLegal(
          amount
        );
      }
    }

    results.push(commission.toFixed(2));
  }

  return results;
};

module.exports = { processOperations };
