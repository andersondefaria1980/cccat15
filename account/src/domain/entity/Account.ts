import crypto from "crypto";
import Name from "../vo/Name";
import Email from "../vo/Email";
import Cpf from "../vo/Cpf";
import CarPlate from "../vo/CarPlate";

export default class Account {
    private name: Name;
    private email: Email;
    private cpf: Cpf;
    private carPlate?: CarPlate;

    private constructor(
        readonly accountId: string,
        name: string,
        email: string,
        cpf: string,
        readonly isPassenger: boolean,
        readonly isDriver?: boolean,
        carPlate?: string,
    ) {
        this.name = new Name(name);
        this.email = new Email(email);
        this.cpf = new Cpf(cpf);
        if (carPlate) this.carPlate = new CarPlate(carPlate);
    }

    public static create(name: string, email: string, cpf: string, isPassenger: boolean, isDriver?: boolean, carPlate?: string): Account {
        const accountId = crypto.randomUUID();
        return new Account(accountId, name, email, cpf, isPassenger, isDriver, carPlate);
    }

    public static restore(accountId: string, name: string, email: string, cpf: string, isPassenger: boolean, isDriver?: boolean, carPlate?: string): Account {
        return new Account(accountId, name, email, cpf, isPassenger, isDriver, carPlate);
    }

    getName() {
        return this.name.getValue();
    }

    getEmail() {
        return this.email.getValue();
    }

    getCpf() {
        return this.cpf.getValue();
    }

    getCarPlte() {
        return this.carPlate?.getValue();
    }
}
