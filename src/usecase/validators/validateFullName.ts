export function validateFullName (fullName: string) {
	const expression: RegExp = /^[A-Za-z]{3,}[ ][A-Za-z]{2,}[A-Za-z ]*$/i;	
	return expression.test(fullName);
}
