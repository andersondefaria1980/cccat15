import AccountRepositoryInMemory from "../../../src/repository/account/AccountRepositoryInMemory";
import SignupUseCase from "../../../src/usecase/account/SignupUseCase";
import Account from "../../../src/domain/Account";
import AccountInput from "../../../src/usecase/account/inputOutputData/AccountInput";

let accountRepository: AccountRepositoryInMemory;
let signupUseCase: SignupUseCase;

beforeEach(() => {
    accountRepository = new AccountRepositoryInMemory();
    signupUseCase = new SignupUseCase(accountRepository);
});

test("Must create an account: ", async function() {
    const accountInput = AccountInput.create("Jose da Silva", "jose@tests.com", "04780028078", true, true, "AAA 1234");
    const createdAccountId = await signupUseCase.execute(accountInput);
    const returnedAccount = await accountRepository.findAccount(createdAccountId);
    
    expect(returnedAccount).toBeInstanceOf(Account);
    expect(typeof returnedAccount?.accountId).toBe("string");
    expect(returnedAccount?.name).toBe(accountInput.name);
    expect(returnedAccount?.email).toBe(accountInput.email);
    expect(returnedAccount?.cpf).toBe(accountInput.cpf);
    expect(returnedAccount?.carPlate).toBe(accountInput.carPlate);
    expect(returnedAccount?.isPassenger).toBe(accountInput.isPassenger);
    expect(returnedAccount?.isDriver).toBe(accountInput.isDriver);
});

test("Must return error if email already exists", async function() {
    const account = Account.create("Jose da Silva", "jose@tests.com", "04780028078", false, true);
    await accountRepository.addAccount(account);
    signupUseCase = new SignupUseCase(accountRepository);
    const accountInput = AccountInput.create("Joao Silveira", "jose@tests.com", "04780028078",  false, true);
    await expect(() => signupUseCase.execute(accountInput)).rejects.toThrow(new Error("Email has already been taken."));
});

test.each([
    {field: 'Name', accountInput: AccountInput.create("Ad a", "jose@tests.com", "04780028078", false, true)},
    {field: 'Email', accountInput: AccountInput.create("Jose da silva", "jose@tests", "04780028078", false, true)},
    {field: 'CPF', accountInput: AccountInput.create("Jose da silva", "jose@tests.com", "123456789", false, true)},
    {field: 'Car plate', accountInput: AccountInput.create("Jose da silva", "jose@tests.com", "04780028078", false, true, "BB 12")},
])("Must return error if field is invalid: %s", async function(object: {field:string, accountInput: AccountInput}) {
    await expect(() => signupUseCase.execute(object.accountInput)).rejects.toThrow(new Error(`${object.field} is invalid.`));
});
