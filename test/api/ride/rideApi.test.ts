import AccountApiTestUtils from "../account/accountApiTestUtils";
import Ride from "../../../src/domain/Ride";

const request = require("supertest");
const baseURL = "http://localhost:3000";
const accountApiTestUtils = new AccountApiTestUtils();

describe("GET /rides", () => {
    it("Should return a list of rides", async () => {
        const response = await request(baseURL).get("/rides");
        expect(response.statusCode).toBe(200);
        const rides = response.body;
        rides.forEach( (r: any) => {
            validateRideResponse(r);
        });
    });
});

describe("GET /rides/:id", () => {
    it("Should return an ride", async () => {
        const responseList = await request(baseURL).get("/rides");
        const firstRide = responseList.body[0];
        const response = await request(baseURL).get(`/rides/${firstRide.rideId}`);
        expect(response.statusCode).toBe(200);
        validateRideResponse(response.body);
    });
    it("Should return not foundt", async () => {
        const response = await request(baseURL).get(`/rides/d05b5be4-d3d0-474f-a3c4-119765f4d07b`);
        expect(response.statusCode).toBe(404);
    });
});

describe("POST /rides/request", () => {
    it("Should create a ride", async () => {
        const [ride, createdRideId] = await createRide();
        const responseGet = await request(baseURL).get(`/rides/${createdRideId}`);
        expect(responseGet.body.rideId).toBe(createdRideId);
        expect(responseGet.body.status).toBe(Ride.STATUS_REQUESTED);
        expect(responseGet.body.from.latitude).toBe(ride.from.latitude);
        expect(responseGet.body.from.longitude).toBe(ride.from.longitude);
        expect(responseGet.body.to.latitude).toBe(ride.to.latitude);
        expect(responseGet.body.to.longitude).toBe(ride.to.longitude);
        expect(responseGet.body.passengerId).toBe(ride.passengerId);
        expect(responseGet.body.driver).toBeUndefined();
        await deleteRide(createdRideId);
        await deleteAccount(ride.passengerId);
    });
});

describe("POST /rides/accept", () => {
    it("Should accept ride", async function () {
        const [ride, createdRideId] = await createRide();
        const driverAccountId = await getAccount(false, true);
        const acceptRideRequestBody = { rideId: createdRideId, driverId: driverAccountId };
        const responseRequestRide = await request(baseURL).post("/rides/accept").send(acceptRideRequestBody);
        expect(responseRequestRide.status).toBe(200);
        const response = await request(baseURL).get(`/rides/${createdRideId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.driverId).toBe(driverAccountId);
        expect(response.body.status).toBe(Ride.STATUS_ACCEPTED);
        await deleteRide(createdRideId);
        await deleteAccount(ride.passengerId);
        await deleteAccount(driverAccountId);
    });
    it("Should return error if driver account is not set as a driver", async function () {
        const [ride, createdRideId] = await createRide();
        const driverAccountId = await getAccount(true, false);
        const acceptRideRequestBody = { rideId: createdRideId, driverId: driverAccountId };
        const responseRequestRide = await request(baseURL).post("/rides/accept").send(acceptRideRequestBody);
        expect(responseRequestRide.status).toBe(400);
        expect(responseRequestRide.body.msg).toBe("Error: Driver account is not set as a driver.");
        await deleteRide(createdRideId);
        await deleteAccount(ride.passengerId);
        await deleteAccount(driverAccountId);
    })
});

describe("POST /rides/start", () => {
    it("Should start a ride", async function () {
        const [ride, createdRideId] = await createRide();
        const driverAccountId = await getAccount(false, true);
        const acceptRideRequestBody = { rideId: createdRideId, driverId: driverAccountId };
        const responseRequestRide = await request(baseURL).post("/rides/accept").send(acceptRideRequestBody);
        expect(responseRequestRide.status).toBe(200);
        const responseStartRide = await request(baseURL).post(`/rides/start`).send({rideId: createdRideId});
        expect(responseStartRide.statusCode).toBe(200);
        const responseAfterStarted = await request(baseURL).get(`/rides/${createdRideId}`);
        expect(responseAfterStarted.body.status).toBe(Ride.STATUS_IN_PROGRESS);
        await deleteRide(createdRideId);
        await deleteAccount(ride.passengerId);
        await deleteAccount(driverAccountId);
    });
    it("Should return error if ride does not have a driver", async function () {
        const [ride, createdRideId] = await createRide();
        const responseStartRide = await request(baseURL).post(`/rides/start`).send({rideId: createdRideId});
        expect(responseStartRide.status).toBe(400);
        expect(responseStartRide.body.msg).toBe("Error: Ride does not have a driver and cannot be started.");
        await deleteRide(createdRideId);
        await deleteAccount(ride.passengerId);
    })
});

function validateRideResponse(r: any) {
    expect(typeof(r.rideId)).toBe("string");
    expect(typeof(r.passengerId)).toBe("string");
    if (r.driver) {
        expect(typeof (r.driverId)).toBe("string");
    }
    expect(typeof(r.status)).toBe("string");
    expect(typeof(r.fare)).toBe("number");
    expect(typeof(r.distance)).toBe("number");
    validateCoordinateResponse(r.from);
    validateCoordinateResponse(r.to);
}

function validateCoordinateResponse(c: any) {
    expect(typeof(c.latitude)).toBe("number");
    expect(typeof(c.longitude)).toBe("number");
}

async function getRideToRequest(): Promise<any> {
    const accountId = await getAccount(true, false);
    return {
        "passengerId": accountId,
        "from": {
            "latitude": 27,
            "longitude": 35
        },
        "to": {
            "latitude": 27.5,
            "longitude": 26
        }
    }
}

async function deleteRide(createdRideId: string) {
    const responseDelete = await request(baseURL).delete(`/rides/${createdRideId}`);
    expect(responseDelete.statusCode).toBe(200)
    const responseGetAfterDelete = await request(baseURL).get(`/rides/${createdRideId}`);
    expect(responseGetAfterDelete.statusCode).toBe(404);
}

async function deleteAccount(createdAccountId: string) {
    const responseDelete = await request(baseURL).delete(`/accounts/${createdAccountId}`);
    expect(responseDelete.statusCode).toBe(200);
    const responseGetAfterDelete = await request(baseURL).get(`/accounts/${createdAccountId}`);
    expect(responseGetAfterDelete.statusCode).toBe(404);
}

async function createRide(): Promise<[any, any]> {
    const ride = await getRideToRequest();
    const responseCreate = await request(baseURL).post("/rides/request").send(ride);
    expect(responseCreate.statusCode).toBe(201);
    expect(responseCreate.body.msg).toBe("Ride requested");
    expect(typeof(responseCreate.body.rideId)).toBe("string");
    return [ride, responseCreate.body.rideId ];
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
    const responseCreate = await request(baseURL).post("/accounts").send(account);
    return responseCreate.body.accountId;
}