import axios from "axios";
import Ride from "../../../src/domain/entity/Ride";

axios.defaults.validateStatus = function () {
    return true;
}

const baseURL = "http://localhost:3000";
const baseURLAccount = "http://localhost:3001";

describe("GET /rides/:id", () => {
    it("Should return an ride", async () => {
        const [ride, createdRideId] = await createRide();
        const response = await axios.get(`${baseURL}/rides/${createdRideId}`);
        expect(response.status).toBe(200);
        validateRideResponse(response.data);
    });
    it("Should return not foundt", async () => {
        const response = await axios.get(`${baseURL}/rides/d05b5be4-d3d0-474f-a3c4-119765f4d07b`);
        expect(response.status).toBe(404);
    });
});

describe("POST /rides/request", () => {
    it("Should create a ride", async () => {
        const [ride, createdRideId] = await createRide();
        const responseGet = await axios.get(`${baseURL}/rides/${createdRideId}`);
        const rideResponse = responseGet.data;
        expect(rideResponse.rideId).toBe(createdRideId);
        expect(rideResponse.status).toBe(Ride.STATUS_REQUESTED);
        expect(rideResponse.fromLat).toBe(ride.from.latitude);
        expect(rideResponse.fromLong).toBe(ride.from.longitude);
        expect(rideResponse.toLat).toBe(ride.to.latitude);
        expect(rideResponse.toLong).toBe(ride.to.longitude);
        expect(rideResponse.lastLat).toBe(ride.from.latitude);
        expect(rideResponse.lastLong).toBe(ride.from.longitude);
        expect(rideResponse.passengerId).toBe(ride.passengerId);
        expect(rideResponse.driver).toBeUndefined();
    });
});

describe("POST /rides/accept", () => {
    it("Should accept ride", async function () {
        const [ride, createdRideId] = await createRide();
        const driverAccountId = await getAccount(false, true);
        const acceptRideRequestBody = { rideId: createdRideId, driverId: driverAccountId };
        const responseAcceptRide = await axios.post(`${baseURL}/rides/accept`, acceptRideRequestBody);
        expect(responseAcceptRide.status).toBe(200);
        const response = await axios.get(`${baseURL}/rides/${createdRideId}`);
        expect(response.status).toBe(200);
        expect(response.data.driverId).toBe(driverAccountId);
        expect(response.data.status).toBe(Ride.STATUS_ACCEPTED);
    });
    it("Should return error if driver account is not set as a driver", async function () {
        const [ride, createdRideId] = await createRide();
        const driverAccountId = await getAccount(true, false);
        const acceptRideRequestBody = { rideId: createdRideId, driverId: driverAccountId };
        const responseRequestRide = await axios.post(`${baseURL}/rides/accept`, acceptRideRequestBody);
        expect(responseRequestRide.status).toBe(422);
        expect(responseRequestRide.data.msg).toBe("Error: Driver account is not set as a driver.");
    })
});

describe("POST /rides/start", () => {
    it("Should start a ride", async function () {
        const [ride, createdRideId] = await createRide();
        const driverAccountId = await getAccount(false, true);
        const acceptRideRequestBody = { rideId: createdRideId, driverId: driverAccountId };
        await axios.post(`${baseURL}/rides/accept`, acceptRideRequestBody);
        const responseStartRide = await axios.post(`${baseURL}/rides/start`, {rideId: createdRideId});
        expect(responseStartRide.status).toBe(200);
        const responseAfterStarted = await axios.get(`${baseURL}/rides/${createdRideId}`);
        expect(responseAfterStarted.data.status).toBe(Ride.STATUS_IN_PROGRESS);
    });
    it("Should return error if ride does not have a driver", async function () {
        const [ride, createdRideId] = await createRide();
        const responseStartRide = await axios.post(`${baseURL}/rides/start`, {rideId: createdRideId});
        expect(responseStartRide.status).toBe(422);
        expect(responseStartRide.data.msg).toBe("Error: Ride does not have a driver and cannot be started.");
    })
});

describe("POST /rides/update-position", () => {
    it("Should update ride position", async function () {
        const [ride, createdRideId] = await createRide();
        const driverAccountId = await getAccount(false, true);
        const acceptRideRequestBody = { rideId: createdRideId, driverId: driverAccountId };
        await axios.post(`${baseURL}/rides/accept`, acceptRideRequestBody);
        await axios.post(`${baseURL}/rides/start`, {rideId: createdRideId});
        const responseUpdatePosition = await axios.post(`${baseURL}/rides/update-position`, {rideId: createdRideId, lat: -27.496887588317275, long: -48.522234807851476});
        expect(responseUpdatePosition.status).toBe(200);
        const responseAfterUpdatePosition = await axios.get(`${baseURL}/rides/${createdRideId}`);
        expect(responseAfterUpdatePosition.data.distance).toBe(10.04);
        expect(responseAfterUpdatePosition.data.lastLat).toBe(-27.496887588317275);
        expect(responseAfterUpdatePosition.data.lastLong).toBe(-48.522234807851476);
    });
    it("Should return error if ride is not in progress", async function () {
        const [ride, createdRideId] = await createRide();
        const driverAccountId = await getAccount(false, true);
        const acceptRideRequestBody = { rideId: createdRideId, driverId: driverAccountId };
        await axios.post(`${baseURL}/rides/accept`, acceptRideRequestBody);
        const responseUpdatePosition = await axios.post(`${baseURL}/rides/update-position`, {rideId: createdRideId, lat: -27.496887588317275, long: -48.522234807851476});
        expect(responseUpdatePosition.status).toBe(422);
        expect(responseUpdatePosition.data.msg).toBe(`Error: Invalid ride status. Position only can be update if status = ${Ride.STATUS_IN_PROGRESS}`);
    })
});

describe("POST /rides/finish", () => {
    it("Should finsh ride and calculate distance and fare", async function () {
        const [ride, createdRideId] = await createRide();
        const driverAccountId = await getAccount(false, true);
        const acceptRideRequestBody = { rideId: createdRideId, driverId: driverAccountId };
        await axios.post(`${baseURL}/rides/accept`, acceptRideRequestBody);
        await axios.post(`${baseURL}/rides/start`, {rideId: createdRideId});
        await axios.post(`${baseURL}/rides/update-position`, {rideId: createdRideId, lat: -27.49, long: -48.52});
        await axios.post(`${baseURL}/rides/update-position`, {rideId: createdRideId, lat: -27.58, long: -48.25});
        const response = await axios.post(`${baseURL}/rides/finish`, {rideId: createdRideId});
        expect(response.status).toBe(200);
        const responseAfterFinished = await axios.get(`${baseURL}/rides/${createdRideId}`);
        expect(responseAfterFinished.data.status).toBe(Ride.STATUS_COMPLETED);
        expect(responseAfterFinished.data.distance).toBe(28.44);
        expect(responseAfterFinished.data.fare).toBe(59.72);
        console.log(createdRideId)
    });
    it("Should return error if ride is not in progress", async function () {
        const [ride, createdRideId] = await createRide();
        const driverAccountId = await getAccount(false, true);
        const acceptRideRequestBody = { rideId: createdRideId, driverId: driverAccountId };
        await axios.post(`${baseURL}/rides/accept`, acceptRideRequestBody);
        const response = await axios.post(`${baseURL}/rides/finish`, {rideId: createdRideId});
        expect(response.status).toBe(422);
        expect(response.data.msg).toBe(`Error: Invalid ride status. Ride only can be finished if status = ${Ride.STATUS_IN_PROGRESS}`);
    })
});

async function getRideToRequest(fromLat?: number, fromLong?: number, toLat?: number, toLong?: number): Promise<any> {
    const accountId = await getAccount(true, false);
    return {
        "passengerId": accountId,
        "from": {
            "latitude": -27.584905257808835,
            "longitude": -48.545022195325124,
        },
        "to": {
            "latitude": -27.496887588317275,
            "longitude": -48.522234807851476,
        }
    }
}

async function createRide(): Promise<[any, any]> {
    const ride = await getRideToRequest();
    const responseCreate = await axios.post(`${baseURL}/rides/request`, ride);
    expect(responseCreate.status).toBe(201);
    expect(responseCreate.data.msg).toBe("Ride requested");
    expect(typeof(responseCreate.data.rideId)).toBe("string");
    return [ride, responseCreate.data.rideId ];
}

async function getAccount(passenger: boolean, driver: boolean):Promise<string>{
    const account = {
        "name": "Roberto da Silva",
        "email": `email_${Math.random()}@gmail.com`,
        "cpf": "02976067945",
        "carPlate": "BBB 1258",
        "password": "pass",
        "isPassenger": passenger,
        "isDriver": driver
    }
    const responseCreate = await axios.post(`${baseURLAccount}/signup`, account);
    return responseCreate.data.accountId;
}

function validateRideResponse(r: any) {
    expect(typeof(r.rideId)).toBe("string");
    expect(typeof(r.passengerId)).toBe("string");
    if (r.driver) {
        expect(typeof (r.driverId)).toBe("string");
    }
    expect(typeof(r.status)).toBe("string");
    expect(typeof(r.fare)).toBe("number");
    expect(typeof(r.distance)).toBe("number");
    expect(typeof(r.fromLat)).toBe("number");
    expect(typeof(r.fromLong)).toBe("number");
    expect(typeof(r.toLat)).toBe("number");
    expect(typeof(r.toLong)).toBe("number");
    expect(typeof(r.lastLat)).toBe("number");
    expect(typeof(r.lastLong)).toBe("number");
}
