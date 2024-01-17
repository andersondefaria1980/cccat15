import crypto from "crypto";
import { AccountRepositoryInterface } from "../repository/accountRepositoryInterface";
import AccountDto from "../domain/accountDto";

export default class SignupUseCase {
    public constructor(private accountRepository: AccountRepositoryInterface) {

    }
    
    public execute(accountDto: AccountDto): string {
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
