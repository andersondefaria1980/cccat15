import AccountApiTestUtils from "../account/accountApiTestUtils";

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

describe("POST /rides/request", () => {
    it("Should create a ride", async () => {
        const account = {
            "name": "Roberto da Silva",
            "email": `email_${Math.random()}@gmail.com`,
            "cpf": "02976067945",
            "carPlate": "BBB 1258",
            "password": "pass",
            "isPassenger": true,
            "isDriver": true
        }
        const responseCreate = await request(baseURL).post("/accounts").send(account);
        expect(responseCreate.statusCode).toBe(201);
        expect(responseCreate.body.msg).toBe("Success: Account is created");
        expect(typeof(responseCreate.body.accountId)).toBe("string");
        const createdAccountId = responseCreate.body.accountId;

        const responseGet = await request(baseURL).get(`/accounts/${createdAccountId}`);
        expect(responseGet.body.accountId).toBe(createdAccountId);
        expect(responseGet.body.name).toBe(account.name);
        expect(responseGet.body.email).toBe(account.email);
        expect(responseGet.body.cpf).toBe(account.cpf);
        expect(responseGet.body.carPlate).toBe(account.carPlate);
        expect(responseGet.body.isPassenger).toBe(account.isPassenger);
        expect(responseGet.body.isDriver).toBe(account.isDriver);

        const responseDelete = await request(baseURL).delete(`/accounts/${createdAccountId}`);
        expect(responseDelete.statusCode).toBe(200)

        const responseGetAfterDelete = await request(baseURL).get(`/accounts/${createdAccountId}`);
        expect(responseGetAfterDelete.statusCode).toBe(404);
    });
});

function validateRideResponse(r: any) {
    expect(typeof(r.rideId)).toBe("string");
    accountApiTestUtils.validateAccountResponse(r.passenger);
    if (r.driver) {
        accountApiTestUtils.validateAccountResponse(r.driver);
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