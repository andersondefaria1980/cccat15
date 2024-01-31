import crypto from "crypto";
import {validateFullName} from "../usecase/validators/validateFullName";
import {validateEmail} from "../usecase/validators/validateEmail";
import {validateCpf} from "../usecase/validators/validateCpf";
import {validateCarPlate} from "../usecase/validators/validateCarPlate";

export default class Account {
    private constructor(
        readonly accountId: string,
        readonly name: string,
        readonly email: string,
        readonly cpf: string,
        readonly isPassenger: boolean,
        readonly isDriver: boolean,
        readonly carPlate?: string,
    ) {
        this.validateAccount();
    }

    private validateAccount() {
        if (!validateFullName(this.name)) throw new Error("Name is invalid.");
        if (!validateEmail(this.email)) throw new Error("Email is invalid.");
        if (!validateCpf(this.cpf)) throw new Error("CPF is invalid.");
        if (this.carPlate && !validateCarPlate(this.carPlate)) throw new Error("Car plate is invalid.");
    }

    public static create(name: string, email: string, cpf: string, isPassenger: boolean, isDriver: boolean, carPlate?: string): Account {
        const accountId = crypto.randomUUID();
        return new Account(accountId, name, email, cpf, isPassenger, isDriver, carPlate);
    }

    public static restore(accountId: string, name: string, email: string, cpf: string, isPassenger: boolean, isDriver: boolean, carPlate?: string): Account {
        return new Account(accountId, name, email, cpf, isPassenger, isDriver, carPlate);
    }

}
