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
        if (!validateFullName(accountDto.getName())) throw new Error("Name is invalid.");   
        if (!validateEmail(accountDto.getEmail())) throw new Error("Email is invalid.");           
        if (!validateCpf(accountDto.getCpf())) throw new Error("CPF is invalid.");
        if (!validateCarPlate(accountDto.getCarPlate())) throw new Error("Car plate is invalid.");
        const accountByEmail = await this.accountRepository.findAccountByEmail(accountDto.getEmail());                        
        if (accountByEmail) throw new Error("Email has already been taken.");
        
        const id = crypto.randomUUID();
        const accountDtoToInsert = new AccountDto(
            id,
            accountDto.getName(),
            accountDto.getEmail(),
            accountDto.getCpf(),
            accountDto.getCarPlate(),
            accountDto.getPassword(),
            accountDto.getIsPassenger(),
            accountDto.getIsDriver(),
        );
        await this.accountRepository.addAccount(accountDtoToInsert);
        return id;
    }
}
