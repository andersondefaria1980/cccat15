import FareCalculatorFactory, {
    NormalFareCalculator,
    OvernightFareCalculator, SundayFareCalculator
} from "../../../src/domain/ds/FareCalculator";

test("Must return normal fare calculator", async function () {
    const fareCalculator = FareCalculatorFactory.create(new Date("2024-02-27T10:00:00-03:00"));
    expect(fareCalculator).toBeInstanceOf(NormalFareCalculator);
});

test("Must return overnight fare calculator", async function () {
    const fareCalculator = FareCalculatorFactory.create(new Date("2024-02-27T03:00:00-03:00"));
    expect(fareCalculator).toBeInstanceOf(OvernightFareCalculator);
});

test("Must return sunday fare calculator", async function () {
    const fareCalculator = FareCalculatorFactory.create(new Date("2024-02-25T10:00:00-03:00"));
    expect(fareCalculator).toBeInstanceOf(SundayFareCalculator);
});