import AccountDTO from "../../../src/domain/accountDto";
import AccountRepositoryInMemory from "../../../src/repository/account/accountRepositoryInMemory";
import UpdateAccountUseCase from "../../../src/usecase/account/updateAccountUseCase";

test("Must update an account: ", async function() {
    const accountRepository = new AccountRepositoryInMemory;    
    const accountId: string = '123';
    const accountDto = new AccountDTO(accountId, "Jose da Silva", "jose@tests.com", "04780028078", "AAA 1234", "123456", false, true);    
    accountRepository.addAccount(accountDto);
    const updateAccountUseCase = new UpdateAccountUseCase(accountRepository);
    const accountDtoBeforeUpdate = new AccountDTO(accountId, "Rodrigo Ferrari", "rodrigo@rodrigo.com", "03717529900", "BBB 9999", "999632", true, false);
    
    await updateAccountUseCase.execute(accountDtoBeforeUpdate);
    const accountDtoAfterUpdate = accountRepository.findAccount(accountId);        
    
    expect(accountDtoAfterUpdate).toBeInstanceOf(AccountDTO);
    expect(accountDtoAfterUpdate?.getAccountId()).toBe(accountDtoBeforeUpdate.getAccountId());
    expect(accountDtoAfterUpdate?.getName()).toBe(accountDtoBeforeUpdate.getName());
    expect(accountDtoAfterUpdate?.getEmail()).toBe(accountDtoBeforeUpdate.getEmail());
    expect(accountDtoAfterUpdate?.getCpf()).toBe(accountDtoBeforeUpdate.getCpf());
    expect(accountDtoAfterUpdate?.getCarPlate()).toBe(accountDtoBeforeUpdate.getCarPlate());
    expect(accountDtoAfterUpdate?.getPassword()).toBe(accountDtoBeforeUpdate.getPassword());
    expect(accountDtoAfterUpdate?.getIsPassenger()).toBe(accountDtoBeforeUpdate.getIsPassenger());
    expect(accountDtoAfterUpdate?.getIsDriver()).toBe(accountDtoBeforeUpdate.getIsDriver());    
});

test("Must return error if email already exists", function() {
    let accountRepository = new AccountRepositoryInMemory;
    const accountDto = new AccountDTO('aaa', "José da Silva", "jose@tests.com", "04780028078", "AAA 1234", "123456", false, true);
    accountRepository.addAccount(accountDto);
    const updateAccountUseCase = new UpdateAccountUseCase(accountRepository);
    const accountDtoToUpdate = new AccountDTO(null, "Joao Silveira", "jose@tests.com", "04780028078", "AAA 5589", "698523", false, true);

    const result = async () => {
        await updateAccountUseCase.execute(accountDtoToUpdate);
    };
    expect(result).rejects.toThrow(Error);
    expect(result).rejects.toThrow("Email has already been taken.");    
});

test.each([
    {field: 'Name', accountDto: new AccountDTO('123', "Ad a", "jose@tests.com", "04780028078", "AAA 1234", "123456", false, true)},
    {field: 'Email', accountDto: new AccountDTO('123', "Jose da silva", "jose@tests", "04780028078", "AAA 1234", "123456", false, true)},
    {field: 'CPF', accountDto: new AccountDTO(null, "Jose da silva", "jose@tests.com", "12345678911", "AAA 1234", "123456", false, true)}
])("Must return error if field is invalid: %s", function(object: {field:string, accountDto: AccountDTO}) {
    let accountRepository = new AccountRepositoryInMemory;
    const updateaAccountUseCase = new UpdateAccountUseCase(accountRepository);    
    
    const result = async () => {
        await updateaAccountUseCase.execute(object.accountDto);
    };
    expect(result).rejects.toThrow(Error);
    expect(result).rejects.toThrow(object.field + " is invalid."); 
});

test("Must return error if account id not found", function() {
    let accountRepository = new AccountRepositoryInMemory;
    const accountDto = new AccountDTO('aaa', "José da Silva", "jose@tests.com", "04780028078", "AAA 1234", "123456", false, true);
    accountRepository.addAccount(accountDto);
    const updateAccountUseCase = new UpdateAccountUseCase(accountRepository);
    const accountDtoToUpdate = new AccountDTO('ccc', "Joao Silveira", "jose_25@tests.com", "04780028078", "AAA 5589", "698523", false, true);

    const result = async () => {
        await updateAccountUseCase.execute(accountDtoToUpdate);
    };
    expect(result).rejects.toThrow(Error);
    expect(result).rejects.toThrow("`Account [ccc] not found.`");    
});