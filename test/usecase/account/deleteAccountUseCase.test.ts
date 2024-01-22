import crypto from "crypto";
import AccountDto from "../../../src/domain/accountDto";
import AccountRepositoryInMemory from "../../../src/repository/account/accountRepositoryInMemory";
import DeleteAccountUseCase from "../../../src/usecase/account/deleteAccountUseCase";

test("Must delete an account", async function() {    
    const accountRepository = new AccountRepositoryInMemory();
    const id = crypto.randomUUID();
    const accountDTO = new AccountDto(id, "José da Silva", "jose@tests.com", "02563258741", "AAA 1234", "123456", false, true);    
    await accountRepository.addAccount(accountDTO);

    const deleteAccountUseCase = new DeleteAccountUseCase(accountRepository);
    await deleteAccountUseCase.execute(id);
    
    const accountFound = await accountRepository.findAccount(id);
    expect(accountFound).toBe(undefined);
});

test("Must return error if account does not exists", async function() {
    const accountRepository = new AccountRepositoryInMemory();
    const id = crypto.randomUUID();
    const deleteAccountUseCase = new DeleteAccountUseCase(accountRepository);
    
    const result = async () => {
        await deleteAccountUseCase.execute(id);
    };
    expect(result).rejects.toThrow(Error);
    expect(result).rejects.toThrow("Account not found.");  
});