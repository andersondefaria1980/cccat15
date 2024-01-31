import crypto from "crypto";
import AccountRepositoryInMemory from "../../../src/repository/account/AccountRepositoryInMemory";
import DeleteAccountUseCase from "../../../src/usecase/account/DeleteAccountUseCase";
import Account from "../../../src/domain/Account";

let accountRepository: AccountRepositoryInMemory;
let deleteAccountUseCase: DeleteAccountUseCase;

beforeEach(() => {
    accountRepository = new AccountRepositoryInMemory();
    deleteAccountUseCase = new DeleteAccountUseCase(accountRepository);
});

test("Must delete an account", async function() {
    const account = Account.create("Jose da Silva", "jose@tests.com", "02976067945", false, true);
    await accountRepository.addAccount(account);
    deleteAccountUseCase = new DeleteAccountUseCase(accountRepository);
    await deleteAccountUseCase.execute(account.accountId);
    const accountFound = await accountRepository.findAccount(account.accountId);
    expect(accountFound).toBe(undefined);
});

test("Must return error if account does not exists", async function() {
    const id = crypto.randomUUID();
    await expect(() => deleteAccountUseCase.execute(id)).rejects.toThrow(new Error("Account not found."))
});
