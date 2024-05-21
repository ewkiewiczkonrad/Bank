const CHANGE_URL = "<URL_TO_API>";
const BASE_URL = `https://${CHANGE_URL}/tasks/api`;

const config = {
  CASH_IN_API_URL: `${BASE_URL}/cash-in`,
  CASH_OUT_NATURAL_API_URL: `${BASE_URL}/cash-out-natural`,
  CASH_OUT_LEGAL_API_URL: `${BASE_URL}/cash-out-juridical`,
};

module.exports = config;
