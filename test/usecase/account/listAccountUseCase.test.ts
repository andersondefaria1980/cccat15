import AccountRepositoryInMemory from "../../../src/repository/account/AccountRepositoryInMemory";
import ListAccountsUseCase from "../../../src/usecase/account/ListAccountsUseCase";
import Account from "../../../src/domain/Account";
import AccountOutput from "../../../src/usecase/account/inputOutputData/AccountOutput";

let accountRepository: AccountRepositoryInMemory;
let listAccountsUseCase: ListAccountsUseCase;

beforeEach(() => {
    accountRepository = new AccountRepositoryInMemory();
    listAccountsUseCase = new ListAccountsUseCase(accountRepository);
});

test("Must return a list of accounts", async function() {
    const account = Account.create("Jose da Silva", "jose@tests.com", "02976067945",  false, true);
    await accountRepository.addAccount(account);
    await accountRepository.addAccount(account);
    
    listAccountsUseCase = new ListAccountsUseCase(accountRepository);
    const accountList = await listAccountsUseCase.execute();
    expect(Array.isArray(accountList)).toBe(true);
    accountList.forEach((returnedAccountOutput: AccountOutput) => {
        expect(returnedAccountOutput).toBeInstanceOf(AccountOutput);
    })    
});
