import CarPlate from "../../../src/domain/vo/CarPlate";

test.each([
	"ABC 1237",
	"XDE 9999",
	"AAA 0585"
])("Car Plate must be vaild: %s", function (plate: string) {
    const carPlate = new CarPlate(plate);
    expect(carPlate.getValue()).toBe(plate);
});

test.each([
	"aaa 123",
	null,
	undefined,
	"AA 1234",
    "ABC 12345"
])("Car Plate must be invalid: %s", async function (carPlate: any) {
	await expect( () => CarPlate.create(carPlate)).rejects.toThrow(new Error("Car plate is invalid"));
});
