import { test, expect } from "bun:test";
import { isInvalid1, isInvalid2 } from ".";

test.each([
	{ value: 1010, invalid: true },
	{ value: 22, invalid: true },
	{ value: 333, invalid: false },
])("isInvalid1($value) = $invalid", ({ value, invalid }) => {
	expect(isInvalid1(value)).toEqual(invalid);
});

test.each([
	{ value: 999, invalid: true },
	{ value: 998, invalid: false },
	{ value: 1010, invalid: true },
])("isInvalid2($value) = $invalid", ({ value, invalid }) => {
	expect(isInvalid2(value)).toEqual(invalid);
});
