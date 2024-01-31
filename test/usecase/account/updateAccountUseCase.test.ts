import AccountRepositoryInMemory from "../../../src/repository/account/AccountRepositoryInMemory";
import UpdateAccountUseCase from "../../../src/usecase/account/UpdateAccountUseCase";
import Account from "../../../src/domain/Account";
import AccountInput from "../../../src/usecase/account/inputOutputData/AccountInput";

let accountRepository: AccountRepositoryInMemory;
let updateAccountUseCase: UpdateAccountUseCase;

beforeEach(() => {
    accountRepository = new AccountRepositoryInMemory();
    updateAccountUseCase = new UpdateAccountUseCase(accountRepository);
});

test("Must update an account: ", async function() {
    const account = Account.create("Jose da Silva", "jose@tests.com", "04780028078", false, true);
    await accountRepository.addAccount(account);
    updateAccountUseCase = new UpdateAccountUseCase(accountRepository);
    const accountInputBeforeUpdate = AccountInput.create("Rodrigo Ferrari", "rodrigo@rodrigo.com", "03717529900", true, true, "AAA 1234");
    await updateAccountUseCase.execute(account.accountId, accountInputBeforeUpdate);
    const accountAfterUpdate = await accountRepository.findAccount(account.accountId);
    expect(accountAfterUpdate).toBeInstanceOf(Account);
    expect(accountAfterUpdate?.accountId).toBe(account.accountId);
    expect(accountAfterUpdate?.name).toBe(accountInputBeforeUpdate.name);
    expect(accountAfterUpdate?.email).toBe(accountInputBeforeUpdate.email);
    expect(accountAfterUpdate?.cpf).toBe(accountInputBeforeUpdate.cpf);
    expect(accountAfterUpdate?.carPlate).toBe(accountInputBeforeUpdate.carPlate);
    expect(accountAfterUpdate?.isPassenger).toBe(accountInputBeforeUpdate.isPassenger);
    expect(accountAfterUpdate?.isDriver).toBe(accountInputBeforeUpdate.isDriver);
});

test("Must return error if email already exists", async function() {
    const account = Account.create("Jose da Silva", "jose@tests.com", "04780028078", false, true);
    const account2 = Account.create("Anderson jose da silva", "anderson.jose@tests.com", "04780028078", false, true);
    await accountRepository.addAccount(account);
    await accountRepository.addAccount(account2);
    const updateAccountUseCase = new UpdateAccountUseCase(accountRepository);
    const accountInputBeforeUpdate = AccountInput.create("Rodrigo Ferrari", "jose@tests.com", "03717529900", true, true, "AAA 1234");
    await expect(() => updateAccountUseCase.execute(account2.accountId, accountInputBeforeUpdate)).rejects.toThrow(new Error("Email has already been taken."));
});

test.each([
    {field: 'Name', accountInput: AccountInput.create("Ad a", "jose@tests.com", "04780028078", false, true)},
    {field: 'Email', accountInput: AccountInput.create("Jose da silva", "jose@tests", "04780028078", false, true)},
    {field: 'CPF', accountInput: AccountInput.create("Jose da silva", "jose@tests.com", "12345678911",  false, true)}
])("Must return error if field is invalid: %s", async function(object: {field:string,  accountInput: AccountInput}) {
        await expect(() => updateAccountUseCase.execute("aaa", object.accountInput)).rejects.toThrow(new Error(object.field + " is invalid."));
});

test("Must return error if account id not found", async function() {
    let accountRepository = new AccountRepositoryInMemory;
    const account = Account.create( "Jose da Silva", "jose@tests.com", "04780028078", false, true);
    await accountRepository.addAccount(account);
    const updateAccountUseCase = new UpdateAccountUseCase(accountRepository);
    const accountInput = AccountInput.create("Joao Silveira", "jose_25@tests.com", "04780028078", false, true);
    await expect(() => updateAccountUseCase.execute("ccc", accountInput)).rejects.toThrow(new Error("Account [ccc] not found."));
});
