import Cpf from "../../../src/domain/vo/Cpf";

test.each([
	"97456321558",
	"71428793860",
	"87748248800"
])("Deve testar se o cpf é válido: %s", function (cpf: string) {
	const cpfVo = new Cpf(cpf);
	expect(cpfVo.getValue()).toBe(cpf);
});

test.each([
	"8774824880",
	null,
	undefined,
	"11111111111"
])("Deve testar se o cpf é inválido: %s", async function (cpf: any) {
    await expect( () => Cpf.create(cpf)).rejects.toThrow(new Error("CPF is invalid"));
});
