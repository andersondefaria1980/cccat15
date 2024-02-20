import Email from "../../../src/domain/vo/Email";

test.each([
	"anddesron.asdfasd@asdfasd.com",
	"sadfasdfas@dfasdf.com.br",
	"asasdf.asdfas.asdfasdf@sad123.as"
])("Email must be vaild: %s", function (email: string) {
    const emailVo = new Email(email);
    expect(emailVo.getValue()).toBe(email);
});

test.each([
	"asdfasdf.com",
	null,
	undefined,
	"asdfasdfsa@asdfasdf",
    "sdtestestestsetsesetsetst"
])("Email must be invalid: %s", async function (email: any) {
    await expect( () => Email.create(email)).rejects.toThrow(new Error("Email is invalid"));
});
