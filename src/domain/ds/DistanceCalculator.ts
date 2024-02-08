import Coordinate from "../vo/Coordinate";

export default class DistanceCalculator {
    public static async calculateDistanceFromCoordinates(from: Coordinate, to: Coordinate): Promise<number> {
        const earthRadius = 6371;
        const degreesToRadians = Math.PI / 180;
        const deltaLat = (to.latitude - from.latitude) * degreesToRadians;
        const deltaLon = (to.longitude - from.longitude) * degreesToRadians;
        const a =
            Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(from.latitude * degreesToRadians) *
            Math.cos(to.latitude * degreesToRadians) *
            Math.sin(deltaLon / 2) *
            Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(earthRadius * c);
    }
}
