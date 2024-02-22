import axios from "axios";

export default interface AccountGatewayInterface {
    findById (accountId: string): Promise<Output|null>;
}

export class AccountGateway implements AccountGatewayInterface {
	async findById (accountId: string): Promise<Output|null> {
        const response= await axios.get(`http://localhost:3001/accounts/${accountId}`).catch((e) => {}).finally();
        return response?.data ? response.data : null;
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
