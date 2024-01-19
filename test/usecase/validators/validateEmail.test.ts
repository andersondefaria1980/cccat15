import { validateEmail } from "../../../src/usecase/validators/validateEmail";

test.each([
	"anddesron.asdfasd@asdfasd.com",
	"sadfasdfas@dfasdf.com.br",
	"asasdf.asdfas.asdfasdf@sad123.as"
])("Email must be vaild: %s", function (email: string) {
	const isValid = validateEmail(email);
	expect(isValid).toBe(true);
});

test.each([
	"asdfasdf.com",
	null,
	undefined,
	"asdfasdfsa@asdfasdf",
    "sdtestestestsetsesetsetst"
])("Email must be invalid: %s", function (email: any) {
	const isValid = validateEmail(email);
	expect(isValid).toBe(false);
});
