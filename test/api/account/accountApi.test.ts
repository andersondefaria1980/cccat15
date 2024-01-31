import AccountApiTestUtils from "./accountApiTestUtils";

const request = require("supertest");
const baseURL = "http://localhost:3000";
const accountApiTestUtils = new AccountApiTestUtils();

describe("PUT /accounts", () => {
    it("Should update an account", async () => {
        const response = await request(baseURL).get("/accounts");
        console.log(response.body);
        expect(response.statusCode).toBe(200);
        const accounts = response.body;
        const accountDataToUpdate = accounts[0];

        const changedAccountDto = {
            "accountId": accountDataToUpdate.accountId,
            "name": "Account Change",
            "email": `email_${Math.random()}@teste-put.com`,
            "cpf": "45133532016",
            "carPlate": "DDD 2222",
            "password": "9999",
            "isPassenger": false,
            "isDriver": false
        };

        const responseUpdate = await request(baseURL).put(`/accounts`).send(changedAccountDto);
        expect(responseUpdate.statusCode).toBe(200);
        expect(responseUpdate.body.msg).toBe("Account updated");

        const responseGet = await request(baseURL).get(`/accounts/${changedAccountDto.accountId}`);
        expect(responseGet.statusCode).toBe(200);
        accountApiTestUtils.validateAccountResponse(responseGet.body);

        expect(responseGet.body.accountId).toBe(changedAccountDto.accountId);
        expect(responseGet.body.name).toBe(changedAccountDto.name);
        expect(responseGet.body.email).toBe(changedAccountDto.email);
        expect(responseGet.body.cpf).toBe(changedAccountDto.cpf);
        expect(responseGet.body.carPlate).toBe(changedAccountDto.carPlate);
        expect(responseGet.body.isPassenger).toBe(changedAccountDto.isPassenger);
        expect(responseGet.body.isDriver).toBe(changedAccountDto.isDriver);
    });
});

describe("GET /accounts", () => {
    it("Should return a list of accounts", async () => {
        const response = await request(baseURL).get("/accounts");
        expect(response.statusCode).toBe(200);
        const accounts = response.body;
        accounts.forEach( (a: any) => {
            accountApiTestUtils.validateAccountResponse(a);
        });
    });
});

describe("GET /accounts/:id", () => {
    it("Should return an account", async () => {
        const responseList = await request(baseURL).get("/accounts");        
        const firstAccount = responseList.body[0];
        
        const response = await request(baseURL).get(`/accounts/${firstAccount.accountId}`);
        expect(response.statusCode).toBe(200);
        accountApiTestUtils.validateAccountResponse(response.body);
    });
    it("Should return not foundt", async () => {
        const response = await request(baseURL).get(`/accounts/d05b5be4-d3d0-474f-a3c4-119765f4d07b`);
        expect(response.statusCode).toBe(404);        
    });
});

describe("POST /accounts", () => {
    it("Should create and delete an account", async () => {
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
        expect(responseCreate.body.msg).toBe("Account created");
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
        expect(responseDelete.statusCode).toBe(200);

        const responseGetAfterDelete = await request(baseURL).get(`/accounts/${createdAccountId}`);
        expect(responseGetAfterDelete.statusCode).toBe(404);
    });
});
