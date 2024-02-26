export default class AccountInput {
    private constructor(
        readonly name: string,
        readonly email: string,
        readonly cpf: string,               
        readonly creditCardToken: string,
        readonly isPassenger: boolean,
        readonly isDriver?: boolean,
        readonly carPlate?: string,
    ){};
    public static create(name: string, email: string, cpf: string, creditCardToken: string, isPassenger: boolean, isDriver: boolean, carPlate?: string) {
        return new AccountInput(name, email, cpf, creditCardToken, isPassenger, isDriver, carPlate);
    }
}
