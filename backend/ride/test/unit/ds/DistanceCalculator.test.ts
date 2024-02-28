import Coordinate from "../../../src/domain/vo/Coordinate";
import DistanceCalculator from "../../../src/domain/ds/DistanceCalculator";

test("Must calculate distance", async function () {
    const fromLat = -27.588272014187325;
    const fromLong = -48.61394608749286;
    const toLat = -27.597054794241224;
    const toLong = -48.5753934252425;
    const coordinateFrom = Coordinate.create(fromLat, fromLong);
    const coordinateTo = Coordinate.create(toLat, toLong);
    const distance = await DistanceCalculator.calculateDistanceFromCoordinates(coordinateFrom, coordinateTo);
    expect(distance).toBe(3.92);
})