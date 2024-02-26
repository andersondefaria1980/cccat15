import AccountRepositoryInMemory from "../../../src/infra/repository/account/AccountRepositoryInMemory";
import SignupUseCase from "../../../src/application/usecase/account/SignupUseCase";
import Account from "../../../src/domain/entity/Account";
import AccountInput from "../../../src/application/usecase/account/inputOutputData/AccountInput";
import {MailerGatewayConsole} from "../../../src/infra/gateway/MailerGateway";

let accountRepository: AccountRepositoryInMemory;
let signupUseCase: SignupUseCase;
let mailerGateway: MailerGatewayConsole;

beforeEach(() => {
    accountRepository = new AccountRepositoryInMemory();
    mailerGateway = new MailerGatewayConsole();
    signupUseCase = new SignupUseCase(accountRepository, mailerGateway);

});

test("Must create an account: ", async function() {
    const accountInput = AccountInput.create("Jose da Silva", "jose@tests.com", "04780028078", "AAA", true, true, "AAA 1234");
    const createdAccountId = await signupUseCase.execute(accountInput);
    const returnedAccount = await accountRepository.findAccount(createdAccountId);
    
    expect(returnedAccount).toBeInstanceOf(Account);
    expect(typeof returnedAccount?.accountId).toBe("string");
    expect(returnedAccount?.getName()).toBe(accountInput.name);
    expect(returnedAccount?.getEmail()).toBe(accountInput.email);
    expect(returnedAccount?.getCpf()).toBe(accountInput.cpf);
    expect(returnedAccount?.getCarPlte()).toBe(accountInput.carPlate);
    expect(returnedAccount?.isPassenger).toBe(accountInput.isPassenger);
    expect(returnedAccount?.isDriver).toBe(accountInput.isDriver);
});

test("Must return error if email already exists", async function() {
    const account = Account.create("Jose da Silva", "jose@tests.com", "04780028078", "AAA", false, true);
    await accountRepository.addAccount(account);
    signupUseCase = new SignupUseCase(accountRepository, mailerGateway);
    const accountInput = AccountInput.create("Joao Silveira", "jose@tests.com", "04780028078",  "AAA", false, true);
    await expect(() => signupUseCase.execute(accountInput)).rejects.toThrow(new Error("Email has already been taken."));
});

test.each([
    {field: 'Name', accountInput: AccountInput.create("Ad a", "jose@tests.com", "04780028078", "AAA", false, true)},
    {field: 'Email', accountInput: AccountInput.create("Jose da silva", "jose@tests", "04780028078", "AAA", false, true)},
    {field: 'CPF', accountInput: AccountInput.create("Jose da silva", "jose@tests.com", "123456789", "AAA", false, true)},
    {field: 'Car plate', accountInput: AccountInput.create("Jose da silva", "jose@tests.com", "04780028078", "AAA", false, true, "BB 12")},
])("Must return error if field is invalid: %s", async function(object: {field:string, accountInput: AccountInput}) {
    await expect(() => signupUseCase.execute(object.accountInput)).rejects.toThrow(new Error(`${object.field} is invalid`));
});
