export default class AccountDto {
    public constructor(
        private accountId: string | null,
        private name: string,
        private email: string,
        private cpf: string,
        private carPlate: string,
        private password: string,
        private isPassenger: boolean,
        private isDriver: boolean,
    ){};

    public getAccountId(): string | null {
        return this.accountId;
    }    
    public getName(): string {
        return this.name;
    }    
    public getEmail(): string {
        return this.email;
    }    
    public getCpf(): string {
        return this.cpf;
    }    
    public getCarPlate(): string {
        return this.carPlate;
    }    
    public getPassword(): string {
        return this.password;
    }    
    public getIsPassenger(): boolean {
        return this.isPassenger;
    }    
    public getIsDriver(): boolean {
        return this.isDriver;
    }    
}
