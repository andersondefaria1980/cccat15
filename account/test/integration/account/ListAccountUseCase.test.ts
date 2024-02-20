import AccountRepositoryInMemory from "../../../src/infra/repository/account/AccountRepositoryInMemory";
import ListAccountsUseCase from "../../../src/application/usecase/account/ListAccountsUseCase";
import Account from "../../../src/domain/entity/Account";
import AccountOutput from "../../../src/application/usecase/account/inputOutputData/AccountOutput";

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
