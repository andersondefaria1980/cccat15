import AccountDto from "../../domain/accountDto";
import { AccountRepositoryInterface } from "../../repository/account/accountRepositoryInterface";
import { validateCpf } from "../validators/validateCpf";
import { validateEmail } from "../validators/validateEmail";
import { validateFullName } from "../validators/validateFullName";

export default class UpdateAccountUseCase {
    public constructor(private accountRepository: AccountRepositoryInterface) {}

    public async execute(accountToUpdate: AccountDto) {
        if (!validateFullName(accountToUpdate.getName())) throw new Error("Name is invalid.");   
        if (!validateEmail(accountToUpdate.getEmail())) throw new Error("Email is invalid.");           
        if (!validateCpf(accountToUpdate.getCpf())) throw new Error("CPF is invalid.");                           
        
        const accountByEmail = await this.accountRepository.findAccountByEmail(accountToUpdate.getEmail());                              
        if (accountByEmail && accountByEmail.getAccountId() !== accountToUpdate.getAccountId()) throw new Error("Email has already been taken.");

        const accountId = typeof(accountToUpdate.getAccountId(), "string") ? accountToUpdate.getAccountId() : "";
        const accountIdToSearch: string = accountId?.toString() ?  accountId.toString() : "";

        let accountDB = await this.accountRepository.findAccount(accountIdToSearch);
        if (!accountDB) {
            throw Error(`Account [${accountIdToSearch}] not found.`);
        }        

        this.accountRepository.updateAccount(accountToUpdate);
    }
}
