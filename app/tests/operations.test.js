const { getWeekNumber } = require("../helpers/helpers");
const { processOperations } = require("../services/operations");
const commissionCalculator = require("../services/calculator");
const { fetchFreeAmountLeft } = require("../services/config");

jest.mock("../helpers/helpers", () => ({
  getWeekNumber: jest.fn(),
}));

jest.mock("../services/config", () => ({
  fetchFreeAmountLeft: jest.fn(),
}));

jest.mock("../services/calculator", () => ({
  calculateCashInCommission: jest.fn(),
  calculateCashOutCommissionNatural: jest.fn(),
  calculateCashOutCommissionLegal: jest.fn(),
}));

describe("processOperations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should process cash in operation correctly", async () => {
    const operations = [
      {
        date: "2023-01-01",
        user_id: 1,
        user_type: "natural",
        type: "cash_in",
        operation: { amount: 200.0, currency: "EUR" },
      },
    ];

    commissionCalculator.calculateCashInCommission.mockResolvedValue(5.0);
    const results = await processOperations(operations);

    expect(commissionCalculator.calculateCashInCommission).toHaveBeenCalledWith(
      200.0
    );
    expect(results).toEqual(["5.00"]);
  });

  it("should process cash out operation for natural person correctly", async () => {
    const operations = [
      {
        date: "2023-01-01",
        user_id: 1,
        user_type: "natural",
        type: "cash_out",
        operation: { amount: 1200.0, currency: "EUR" },
      },
    ];

    getWeekNumber.mockReturnValue(1);
    fetchFreeAmountLeft.mockResolvedValue(1000.0);
    commissionCalculator.calculateCashOutCommissionNatural.mockResolvedValue(
      0.6
    );

    const results = await processOperations(operations);

    expect(getWeekNumber).toHaveBeenCalledWith(new Date("2023-01-01"));
    expect(fetchFreeAmountLeft).toHaveBeenCalledWith(0);
    expect(
      commissionCalculator.calculateCashOutCommissionNatural
    ).toHaveBeenCalledWith(1200.0, 1000.0);
    expect(results).toEqual(["0.60"]);
  });

  it("should process cash out operation for juridical person correctly", async () => {
    const operations = [
      {
        date: "2023-01-01",
        user_id: 1,
        user_type: "juridical",
        type: "cash_out",
        operation: { amount: 500.0, currency: "EUR" },
      },
    ];

    commissionCalculator.calculateCashOutCommissionLegal.mockResolvedValue(1.5);
    const results = await processOperations(operations);

    expect(
      commissionCalculator.calculateCashOutCommissionLegal
    ).toHaveBeenCalledWith(500.0);
    expect(results).toEqual(["1.50"]);
  });

  it("should throw an error for unsupported currency", async () => {
    const operations = [
      {
        date: "2023-01-01",
        user_id: 1,
        user_type: "natural",
        type: "cash_in",
        operation: { amount: 200.0, currency: "USD" },
      },
    ];

    await expect(processOperations(operations)).rejects.toThrow(
      "Unsupported currency"
    );
  });
});
