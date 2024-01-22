import crypto from "crypto";
import { AccountRepositoryInterface } from "../../repository/account/accountRepositoryInterface";
import AccountDto from "../../domain/accountDto";
import { validateFullName } from "../validators/validateFullName";
import { validateEmail } from "../validators/validateEmail";
import { validateCpf } from "../validators/validateCpf";

export default class SignupUseCase {
    public constructor(private accountRepository: AccountRepositoryInterface) {

    }
    
    public async execute(accountDto: AccountDto) {
        if (!validateFullName(accountDto.getName())) throw new Error("Name is invalid.");   
        if (!validateEmail(accountDto.getEmail())) throw new Error("Email is invalid.");           
        if (!validateCpf(accountDto.getCpf())) throw new Error("CPF is invalid.");                   
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
        this.accountRepository.addAccount(accountDtoToInsert);
        return id;
    }
}
