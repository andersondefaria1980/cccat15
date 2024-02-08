import AccountApiTestUtils from "./accountApiTestUtils";
import axios from "axios";

axios.defaults.validateStatus = function () {
    return true;
}

const baseURL = "http://localhost:3000";
const accountApiTestUtils = new AccountApiTestUtils();

// integration test com uma granularidade mais grossa
describe("POST /signup", () => {
    test("Should create a passenger account", async function () {
        const input = {
            name: "John Doe",
            email: `john.doe${Math.random()}@gmail.com`,
            cpf: "97456321558",
            isPassenger: true
        };
        const responseSignup = await axios.post("http://localhost:3000/signup", input);
        const outputSignup = responseSignup.data;
        expect(outputSignup.accountId).toBeDefined();
        const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
        const outputGetAccount = responseGetAccount.data;
        expect(outputGetAccount.name).toBe(input.name);
        expect(outputGetAccount.email).toBe(input.email);
        expect(outputGetAccount.cpf).toBe(input.cpf);
        expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
    });
});

describe("GET /accounts/:id", () => {
    it("Should return an account", async () => {
        const input = {
            name: "John Doe",
            email: `john.doe${Math.random()}@gmail.com`,
            cpf: "97456321558",
            isPassenger: true,
            isDriver: true,
            carPlate: "AAA 1242",
        };
        const responseSignup = await axios.post("http://localhost:3000/signup", input);

        const response = await axios.get(`${baseURL}/accounts/${responseSignup.data.accountId}`);
        expect(response.status).toBe(200);
        accountApiTestUtils.validateAccountResponse(response.data);
    });
    it("Should return not foundt", async () => {
        const response = await axios.get(`${baseURL}/accounts/d05b5be4-d3d0-474f-a3c4-119765f4d07b`);
        expect(response.status).toBe(404);
    });
});
