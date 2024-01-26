import crypto from "crypto";
import AccountDto from "../../../src/domain/AccountDto";
import AccountRepositoryInMemory from "../../../src/repository/account/AccountRepositoryInMemory";
import DeleteAccountUseCase from "../../../src/usecase/account/DeleteAccountUseCase";

let accountRepository: AccountRepositoryInMemory;
let deleteAccountUseCase: DeleteAccountUseCase;

beforeEach(() => {
    accountRepository = new AccountRepositoryInMemory();
    deleteAccountUseCase = new DeleteAccountUseCase(accountRepository);
});

test("Must delete an account", async function() {
    const id = crypto.randomUUID();
    const accountDTO = new AccountDto(id, "José da Silva", "jose@tests.com", "02563258741", "AAA 1234", "123456", false, true);    
    await accountRepository.addAccount(accountDTO);
    deleteAccountUseCase = new DeleteAccountUseCase(accountRepository);
    await deleteAccountUseCase.execute(id);
    const accountFound = await accountRepository.findAccount(id);
    expect(accountFound).toBe(undefined);
});

test("Must return error if account does not exists", async function() {
    const id = crypto.randomUUID();
    await expect(() => deleteAccountUseCase.execute(id)).rejects.toThrow(new Error("Account not found."))
});
