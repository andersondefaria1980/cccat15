import Coordinate from "../../../src/domain/vo/Coordinate";
import {errors} from "pg-promise";

test.each([
    {lat: -27.584905257808835, long: -48.545022195325124},
    {lat: 90, long: 160},
    {lat: -89.999, long: 160},
])("Coordinate must be vaild: %s", async function (postition: {lat: number, long: number}) {
    const coordinate = await Coordinate.create(postition.lat, postition.long);
    expect(coordinate.latitude).toBe(postition.lat);
    expect(coordinate.longitude).toBe(postition.long);
});

test.each([
    {lat: -27.584905257808835, long: -181, error: "Longitude is invalid"},
    {lat: 91, long: 160, error: "Latitude is invalid"},
    {lat: -90.666, long: 180, error: "Latitude is invalid"},
])("Coodinate must be invalid: %s", async function (position: {lat: number, long: number, error: string}) {
    await expect( () => Coordinate.create(position.lat, position.long)).toThrow(new Error(`${position.error}`));
});
