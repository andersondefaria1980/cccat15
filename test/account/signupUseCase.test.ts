import AccountDTO from "../../src/domain/accountDto";
import AccountRepositoryInMemory from "../../src/repository/account/accountRepositoryInMemory";
import GetAccountUseCase from "../../src/usecase/account/getAccountUseCase";
import SignupUseCase from "../../src/usecase/account/signupUseCase";

test("Must create an account: ", function() {
    let accountRepository = new AccountRepositoryInMemory;
    const signupUseCase = new SignupUseCase(accountRepository);
    const accountDTO = new AccountDTO(null, "Jose da Silva", "jose@tests.com", "04780028078", "AAA 1234", "123456", false, true);
    
    const createdAccountId = signupUseCase.execute(accountDTO);
    const getAccountUseCase = new GetAccountUseCase(accountRepository);
    const returnedAccountDTO = getAccountUseCase.execute(createdAccountId);
    
    expect(returnedAccountDTO).toBeInstanceOf(AccountDTO);
    expect(typeof returnedAccountDTO?.getAccountId()).toBe("string");
    expect(returnedAccountDTO?.getName()).toBe(accountDTO.getName());
    expect(returnedAccountDTO?.getEmail()).toBe(accountDTO.getEmail());
    expect(returnedAccountDTO?.getCpf()).toBe(accountDTO.getCpf());
    expect(returnedAccountDTO?.getCarPlate()).toBe(accountDTO.getCarPlate());
    expect(returnedAccountDTO?.getPassword()).toBe(accountDTO.getPassword());
    expect(returnedAccountDTO?.getIsPassenger()).toBe(accountDTO.getIsPassenger());
    expect(returnedAccountDTO?.getIsDriver()).toBe(accountDTO.getIsDriver());    
});

test("Must return error if email already exists", function() {
    let accountRepository = new AccountRepositoryInMemory;
    const accountDto = new AccountDTO('aaa', "José da Silva", "jose@tests.com", "04780028078", "AAA 1234", "123456", false, true);
    accountRepository.addAccount(accountDto);
    const signupUseCase = new SignupUseCase(accountRepository);
    const accountDtoToSignup = new AccountDTO(null, "Joao Silveira", "jose@tests.com", "04780028078", "AAA 5589", "698523", false, true);

    const result = () => {
        signupUseCase.execute(accountDtoToSignup);
    };
    expect(result).toThrow(Error);
    expect(result).toThrow("Email has already been taken.");    
});

test.each([
    {field: 'Name', accountDto: new AccountDTO(null, "Ad a", "jose@tests.com", "04780028078", "AAA 1234", "123456", false, true)},
    {field: 'Email', accountDto: new AccountDTO(null, "Jose da silva", "jose@tests", "04780028078", "AAA 1234", "123456", false, true)},
    {field: 'CPF', accountDto: new AccountDTO(null, "Jose da silva", "jose@tests.com", "12345678911", "AAA 1234", "123456", false, true)}
])("Must return error if field is invalid: %s", function(object: {field:string, accountDto: AccountDTO}) {
    let accountRepository = new AccountRepositoryInMemory;
    const signupUseCase = new SignupUseCase(accountRepository);    
    
    const result = () => {
        signupUseCase.execute(object.accountDto);
    };
    expect(result).toThrow(Error);
    expect(result).toThrow(object.field + " is invalid."); 
});
