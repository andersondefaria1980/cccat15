import HttpClient from "../http/HttpClient";

export default interface AccountGatewayInterface {
    findById(accountId: string): Promise<Output | null>;
}

export class AccountGateway implements AccountGatewayInterface {
    constructor(readonly httpClient: HttpClient) {
    }

    async findById(accountId: string): Promise<Output | null> {
        return this.httpClient.get(`http://localhost:3001/accounts/${accountId}`).catch((e) => {}).finally();
    }

    async signup(input: any): Promise<any> {
        return this.httpClient.post(`http://localhost:3001/signup`, input);
    }
}

type Output = {
    accountId: string,
    name: string,
    email: string,
    cpf: string,
    creditCardToken: string,
    isPassenger: boolean,
    isDriver?: boolean,
    carPlate?: string,
}
