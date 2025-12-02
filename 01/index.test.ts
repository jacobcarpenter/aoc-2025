import { test, expect } from "bun:test";
import { rotateBy, rotateByWithZerosCount } from ".";

test.each([
	{ initial: 0, direction: "R", turns: 1, expected: 1 },
	{ initial: 0, direction: "L", turns: 1, expected: 99 },
	{ initial: 5, direction: "L", turns: 6, expected: 99 },
	{ initial: 3, direction: "L", turns: 1, expected: 2 },
	{ initial: 0, direction: "L", turns: 3, expected: 97 },
	{ initial: 2, direction: "R", turns: 5, expected: 7 },
])(
	"rotateBy($initial, $direction, $turns) = $expected",
	({ initial, direction, turns, expected }) => {
		expect(rotateBy(initial, direction, turns)).toEqual(expected);
	},
);

test.each([
	{ initial: 0, direction: "R", turns: 1, expected: { value: 1, zeros: 0 } },
	{ initial: 0, direction: "L", turns: 1, expected: { value: 99, zeros: 0 } },
	{ initial: 0, direction: "L", turns: 99, expected: { value: 1, zeros: 0 } },
	{ initial: 0, direction: "L", turns: 100, expected: { value: 0, zeros: 0 } },
	{ initial: 0, direction: "R", turns: 100, expected: { value: 0, zeros: 0 } },
	{ initial: 50, direction: "R", turns: 1000, expected: { value: 50, zeros: 10 } },
	{ initial: 98, direction: "R", turns: 3, expected: { value: 1, zeros: 1 } },
	{ initial: 82, direction: "L", turns: 30, expected: { value: 52, zeros: 0 } },
])(
	"rotateByWithOverflowCount($initial, $direction, $turns) = $expected.value, zeros = $expected.zeros",
	({ initial, direction, turns, expected }) => {
		expect(rotateByWithZerosCount(initial, direction, turns)).toEqual(expected);
	},
);
