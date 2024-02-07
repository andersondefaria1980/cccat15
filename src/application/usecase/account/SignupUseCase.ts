import { AccountRepositoryInterface } from "../../../repository/account/AccountRepositoryInterface";
import Account from "../../../domain/entity/Account";
import AccountInput from "./inputOutputData/AccountInput";

export default class SignupUseCase {
    public constructor(readonly accountRepository: AccountRepositoryInterface) {}
    
    public async execute(input: AccountInput) {
        const accountByEmail = await this.accountRepository.findAccountByEmail(input.email);
        if (accountByEmail) throw new Error("Email has already been taken.");
        const account = Account.create(input.name, input.email, input.cpf, input.isPassenger, input.isDriver, input.carPlate);
        await this.accountRepository.addAccount(account);
        return account.accountId;
    }
}
