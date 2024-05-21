const { roundUp } = require("../helpers/helpers");
const {
  calculateCashInCommission,
  calculateCashOutCommissionNatural,
  calculateCashOutCommissionLegal,
} = require("../services/calculator");

const {
  fetchCashInConfig,
  fetchCashOutNaturalConfig,
  fetchCashOutLegalConfig,
} = require("../services/config");

jest.mock("../helpers/helpers", () => ({
  roundUp: jest.fn(),
}));

jest.mock("../services/config", () => ({
  fetchCashInConfig: jest.fn(),
  fetchCashOutNaturalConfig: jest.fn(),
  fetchCashOutLegalConfig: jest.fn(),
}));

describe("Commission Calculator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("calculateCashInCommission", () => {
    it("should calculate the correct commission fee", async () => {
      const config = {
        percents: 0.03,
        max: 5,
      };
      fetchCashInConfig.mockResolvedValue(config);
      roundUp.mockImplementation((num) => Math.ceil(num * 100) / 100);

      const amount = 200;
      const commission = await calculateCashInCommission(amount);

      expect(fetchCashInConfig).toHaveBeenCalled();
      expect(roundUp).toHaveBeenCalledWith(5);
      expect(commission).toBe(5);
    });

    it("should calculate the correct commission fee for small amounts", async () => {
      const config = {
        percents: 0.03,
        max: 5,
      };
      fetchCashInConfig.mockResolvedValue(config);
      roundUp.mockImplementation((num) => Math.ceil(num * 100) / 100);

      const amount = 100;
      const commission = await calculateCashInCommission(amount);

      expect(fetchCashInConfig).toHaveBeenCalled();
      expect(roundUp).toHaveBeenCalledWith(3);
      expect(commission).toBe(3);
    });
  });

  describe("calculateCashOutCommissionNatural", () => {
    it("should calculate the correct commission fee for cash out natural", async () => {
      const config = {
        percents: 0.003,
        weekLimit: 1000,
      };
      fetchCashOutNaturalConfig.mockResolvedValue(config);
      roundUp.mockImplementation((num) => Math.ceil(num * 100) / 100);

      const amount = 1200;
      const freeAmountLeft = 1000;
      const commission = await calculateCashOutCommissionNatural(
        amount,
        freeAmountLeft
      );

      expect(fetchCashOutNaturalConfig).toHaveBeenCalled();
      expect(roundUp).toHaveBeenCalledWith(0.6);
      expect(commission).toBe(0.6);
    });

    it("should calculate zero commission fee if within free limit", async () => {
      const config = {
        percents: 0.003,
        weekLimit: 1000,
      };
      fetchCashOutNaturalConfig.mockResolvedValue(config);
      roundUp.mockImplementation((num) => Math.ceil(num * 100) / 100);

      const amount = 800;
      const freeAmountLeft = 1000;
      const commission = await calculateCashOutCommissionNatural(
        amount,
        freeAmountLeft
      );

      expect(fetchCashOutNaturalConfig).toHaveBeenCalled();
      expect(roundUp).toHaveBeenCalledWith(0);
      expect(commission).toBe(0);
    });
  });

  describe("calculateCashOutCommissionLegal", () => {
    it("should calculate the correct commission fee for cash out legal", async () => {
      const config = {
        percents: 0.003,
        min: 0.5,
      };
      fetchCashOutLegalConfig.mockResolvedValue(config);
      roundUp.mockImplementation((num) => Math.ceil(num * 100) / 100);

      const amount = 1000;
      const commission = await calculateCashOutCommissionLegal(amount);

      expect(fetchCashOutLegalConfig).toHaveBeenCalled();
      expect(roundUp).toHaveBeenCalledWith(3);
      expect(commission).toBe(3);
    });

    it("should calculate the minimum commission fee if calculated fee is below minimum", async () => {
      const config = {
        percents: 0.003,
        min: 0.5,
      };
      fetchCashOutLegalConfig.mockResolvedValue(config);
      roundUp.mockImplementation((num) => Math.ceil(num * 100) / 100);

      const amount = 100;
      const commission = await calculateCashOutCommissionLegal(amount);

      expect(fetchCashOutLegalConfig).toHaveBeenCalled();
      expect(roundUp).toHaveBeenCalledWith(0.5);
      expect(commission).toBe(0.5);
    });
  });
});
