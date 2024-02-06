import { validateFullName } from "../../../src/usecase/validators/validateFullName";

test.each([
	"aaa de aaa",
	"sdfasdfas asdfasdfsa asdfasdf sadf asd fsa",
	"Anders Jopse"
])("Email must be vaild: %s", function (email: string) {
	const isValid = validateFullName(email);
	expect(isValid).toBe(true);
});

test.each([
	"aa aaa",
	null,
	undefined,
	"asdfasd d. aaa",
    "asadfasdfsadfafafasdfasdfasdfasdf"
])("Email must be invalid: %s", function (email: any) {
	const isValid = validateFullName(email);
	expect(isValid).toBe(false);
});
