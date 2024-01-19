import AccountDto from "../../../src/domain/accountDto";
import AccountRepositoryInMemory from "../../../src/repository/account/accountRepositoryInMemory";
import DeleteAccountUseCase from "../../../src/usecase/account/deleteAccountUseCase";

test("Must delete an account", function() {
    const accountRepository = new AccountRepositoryInMemory();
    const id = crypto.randomUUID();
    const accountDTO = new AccountDto(id, "José da Silva", "jose@tests.com", "02563258741", "AAA 1234", "123456", false, true);
    accountRepository.addAccount(accountDTO);

    const deleteAccountUseCase = new DeleteAccountUseCase(accountRepository);
    deleteAccountUseCase.execute(id);

    const accountFound = accountRepository.findAccount(id);
    expect(accountFound).toBe(undefined)
});