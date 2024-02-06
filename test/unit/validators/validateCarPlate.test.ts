import { validateCarPlate } from "../../../src/usecase/validators/validateCarPlate";

test.each([
	"ABC 1237",
	"XDE 9999",
	"AAA 0585"
])("Car Plate must be vaild: %s", function (carPlate: string) {
	const isValid = validateCarPlate(carPlate);
	expect(isValid).toBe(true);
});

test.each([
	"aaa 123",
	null,
	undefined,
	"AA 1234",
    "ABC 12345"
])("Car Plate must be invalid: %s", function (carPlate: any) {
	const isValid = validateCarPlate(carPlate);
	expect(isValid).toBe(false);
});
