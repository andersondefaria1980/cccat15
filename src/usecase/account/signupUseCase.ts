import crypto from "crypto";
import { AccountRepositoryInterface } from "../../repository/account/accountRepositoryInterface";
import AccountDto from "../../domain/accountDto";
import { validateFullName } from "../validators/validateFullName";
import { validateEmail } from "../validators/validateEmail";
import { validateCpf } from "../validators/validateCpf";
import {validateCarPlate} from "../validators/validateCarPlate";

export default class SignupUseCase {
    public constructor(readonly accountRepository: AccountRepositoryInterface) {}
    
    public async execute(accountDto: AccountDto) {
        if (!validateFullName(accountDto.name)) throw new Error("Name is invalid.");
        if (!validateEmail(accountDto.email)) throw new Error("Email is invalid.");
        if (!validateCpf(accountDto.cpf)) throw new Error("CPF is invalid.");
        if (!validateCarPlate(accountDto.carPlate)) throw new Error("Car plate is invalid.");
        const accountByEmail = await this.accountRepository.findAccountByEmail(accountDto.email);
        if (accountByEmail) throw new Error("Email has already been taken.");
        
        const id = crypto.randomUUID();
        const accountDtoToInsert = new AccountDto(
            id,
            accountDto.name,
            accountDto.email,
            accountDto.cpf,
            accountDto.carPlate,
            accountDto.password,
            accountDto.isPassenger,
            accountDto.isDriver,
        );
        console.log(accountDtoToInsert);
        await this.accountRepository.addAccount(accountDtoToInsert);
        return id;
    }
}
