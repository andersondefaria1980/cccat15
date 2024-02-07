import Name from "../../../src/domain/vo/Name";

test.each([
	"aaa de aaa",
	"sdfasdfas asdfasdfsa asdfasdf sadf asd fsa",
	"Anders Jopse"
])("Name must be vaild: %s", function (name: string) {
    const nameVo = new Name(name);
    expect(nameVo.getValue()).toBe(name);
});

test.each([
	"aa aaa",
	null,
	undefined,
	"asdfasd d. aaa",
    "asadfasdfsadfafafasdfasdfasdfasdf"
])("Email must be invalid: %s", async function (name: any) {
    await expect( () => Name.create(name)).rejects.toThrow(new Error("Name is invalid"));
});
