import { AccountRepositoryInterface } from "../../repository/account/AccountRepositoryInterface";
import AccountInput from "./inputOutputData/AccountInput";
import Account from "../../domain/Account";

export default class SignupUseCase {
    public constructor(readonly accountRepository: AccountRepositoryInterface) {}
    
    public async execute(input: AccountInput) {
        const account = Account.create(input.name, input.email, input.cpf, input.isPassenger, input.isDriver, input.carPlate);
        const accountByEmail = await this.accountRepository.findAccountByEmail(account.email);
        if (accountByEmail) throw new Error("Email has already been taken.");
        await this.accountRepository.addAccount(account);
        return account.accountId;
    }
}
