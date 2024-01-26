export default class AccountDto {
    public constructor(
        private _accountId: string | null,
        private _name: string,
        private _email: string,
        private _cpf: string,
        private _carPlate: string,
        private _password: string,
        private _isPassenger: boolean,
        private _isDriver: boolean,
    ){};

    get accountId(): string | null {
        return this._accountId;
    }

    get name(): string {
        return this._name;
    }

    get email(): string {
        return this._email;
    }

    get cpf(): string {
        return this._cpf;
    }

    get carPlate(): string {
        return this._carPlate;
    }

    get password(): string {
        return this._password;
    }

    get isPassenger(): boolean {
        return this._isPassenger;
    }

    get isDriver(): boolean {
        return this._isDriver;
    }

    public toApi() {
        return {
            accountId: this.accountId,
            name: this.name,
            email: this.email,
            cpf: this.cpf,
            carPlate: this.carPlate,
            isPassenger: this.isPassenger,
            isDriver: this.isDriver,
        };
    }
}
