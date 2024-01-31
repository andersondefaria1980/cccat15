import Account from "../../../domain/Account";

export default class AccountOutput {
    private constructor(
        readonly accountId: string,
        readonly name: string,
        readonly email: string,
        readonly cpf: string,               
        readonly isPassenger: boolean,
        readonly isDriver: boolean,
        readonly carPlate?: string,
    ){};

    public static create(account: Account) {
        return new AccountOutput(account.accountId, account.name, account.email, account.cpf, account.isPassenger, account.isDriver, account.carPlate);
    }
}
