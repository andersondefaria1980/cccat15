import AccountDTO from "../../../src/domain/accountDto";
import AccountRepositoryInMemory from "../../../src/repository/account/accountRepositoryInMemory";
import UpdateAccountUseCase from "../../../src/usecase/account/updateAccountUseCase";

let accountRepository: AccountRepositoryInMemory;
let updateAccountUseCase: UpdateAccountUseCase;

beforeEach(() => {
    accountRepository = new AccountRepositoryInMemory();
    updateAccountUseCase = new UpdateAccountUseCase(accountRepository);
});

test("Must update an account: ", async function() {
    const accountId: string = '123';
    const accountDto = new AccountDTO(accountId, "Jose da Silva", "jose@tests.com", "04780028078", "AAA 1234", "123456", false, true);    
    accountRepository.addAccount(accountDto);
    updateAccountUseCase = new UpdateAccountUseCase(accountRepository);
    const accountDtoBeforeUpdate = new AccountDTO(accountId, "Rodrigo Ferrari", "rodrigo@rodrigo.com", "03717529900", "BBB 9999", "999632", true, false);
    await updateAccountUseCase.execute(accountDtoBeforeUpdate);
    const accountDtoAfterUpdate = await accountRepository.findAccount(accountId);
    expect(accountDtoAfterUpdate).toBeInstanceOf(AccountDTO);
    expect(accountDtoAfterUpdate?.accountId).toBe(accountDtoBeforeUpdate.accountId);
    expect(accountDtoAfterUpdate?.name).toBe(accountDtoBeforeUpdate.name);
    expect(accountDtoAfterUpdate?.email).toBe(accountDtoBeforeUpdate.email);
    expect(accountDtoAfterUpdate?.cpf).toBe(accountDtoBeforeUpdate.cpf);
    expect(accountDtoAfterUpdate?.carPlate).toBe(accountDtoBeforeUpdate.carPlate);
    expect(accountDtoAfterUpdate?.password).toBe(accountDtoBeforeUpdate.password);
    expect(accountDtoAfterUpdate?.isPassenger).toBe(accountDtoBeforeUpdate.isPassenger);
    expect(accountDtoAfterUpdate?.isDriver).toBe(accountDtoBeforeUpdate.isDriver);
});

test("Must return error if email already exists", async function() {
    const accountDto = new AccountDTO('aaa', "José da Silva", "jose@tests.com", "04780028078", "AAA 1234", "123456", false, true);
    accountRepository.addAccount(accountDto);
    const updateAccountUseCase = new UpdateAccountUseCase(accountRepository);
    const accountDtoToUpdate = new AccountDTO(null, "Joao Silveira", "jose@tests.com", "04780028078", "AAA 5589", "698523", false, true);
    await expect(() => updateAccountUseCase.execute(accountDtoToUpdate)).rejects.toThrow(new Error("Email has already been taken."));
});

test.each([
    {field: 'Name', accountDto: new AccountDTO('123', "Ad a", "jose@tests.com", "04780028078", "AAA 1234", "123456", false, true)},
    {field: 'Email', accountDto: new AccountDTO('123', "Jose da silva", "jose@tests", "04780028078", "AAA 1234", "123456", false, true)},
    {field: 'CPF', accountDto: new AccountDTO(null, "Jose da silva", "jose@tests.com", "12345678911", "AAA 1234", "123456", false, true)}
])("Must return error if field is invalid: %s", async function(object: {field:string, accountDto: AccountDTO}) {
    await expect(() => updateAccountUseCase.execute(object.accountDto)).rejects.toThrow(new Error(object.field + " is invalid."));
});

test("Must return error if account id not found", async function() {
    let accountRepository = new AccountRepositoryInMemory;
    const accountDto = new AccountDTO('aaa', "José da Silva", "jose@tests.com", "04780028078", "AAA 1234", "123456", false, true);
    accountRepository.addAccount(accountDto);
    const updateAccountUseCase = new UpdateAccountUseCase(accountRepository);
    const accountDtoToUpdate = new AccountDTO('ccc', "Joao Silveira", "jose_25@tests.com", "04780028078", "AAA 5589", "698523", false, true);
    await expect(() => updateAccountUseCase.execute(accountDtoToUpdate)).rejects.toThrow(new Error("Account [ccc] not found."));
});
