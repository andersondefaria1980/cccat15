const request = require("supertest");
const baseURL = "http://localhost:3000";

describe("GET /accounts", () => {
    it("Should return a list of accounts", async () => {
        const response = await request(baseURL).get("/accounts");
        expect(response.statusCode).toBe(200);
        const accounts = response.body;
        accounts.forEach( (a: any) => {
            validateAccountResponse(a);
        });
    });
});

describe("GET /accounts/:id", () => {
    it("Should return an account", async () => {
        const responseList = await request(baseURL).get("/accounts");        
        const firstAccount = responseList.body[0];
        
        const response = await request(baseURL).get(`/accounts/${firstAccount.accountId}`);
        expect(response.statusCode).toBe(200);
        validateAccountResponse(response.body);    
    });
});

describe("POST /accounts", () => {
    it("Should create and delete an account", async () => {
        const account = {
            "name": "Roberto da Silva",
            "email": "roberto@gmail.com",
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
        expect(responseGet.statusCode).toBe(200);
        validateAccountResponse(responseGet.body);
        
        const responseDelete = await request(baseURL).delete(`/accounts/${createdAccountId}`);
        expect(responseDelete.statusCode).toBe(200);
        expect(responseDelete.body.msg).toBe("Account deleted");

        const responseGetAfterDelete = await request(baseURL).get(`/accounts/${createdAccountId}`);
        expect(responseGetAfterDelete.statusCode).toBe(404); 
        expect(responseGetAfterDelete.body.msg).toBe("Account not found");        
    });
});

function validateAccountResponse(a: any) {
    expect(typeof(a.accountId)).toBe("string");
    expect(typeof(a.name)).toBe("string");
    expect(typeof(a.email)).toBe("string");
    expect(typeof(a.cpf)).toBe("string");
    expect(typeof(a.carPlate)).toBe("string");
    expect(typeof(a.password)).toBe("string");
    expect(typeof(a.isPassenger)).toBe("boolean");
    expect(typeof(a.isDriver)).toBe("boolean");
}