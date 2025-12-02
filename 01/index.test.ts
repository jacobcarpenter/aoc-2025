import { test, expect } from "bun:test";
import { rotateBy, countPassedZeros } from ".";

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
	{ initial: 0, direction: "R", turns: 1, expected: 0 },
	{ initial: 0, direction: "L", turns: 1, expected: 0 },
	{ initial: 0, direction: "L", turns: 99, expected: 0 },
	{ initial: 0, direction: "L", turns: 100, expected: 1 },
	{ initial: 50, direction: "R", turns: 1000, expected: 10 },
	{ initial: 98, direction: "R", turns: 3, expected: 1 },
	{ initial: 82, direction: "L", turns: 30, expected: 0 },
])(
	"countPassedZeros($initial, $direction, $turns) = $expected",
	({ initial, direction, turns, expected }) => {
		expect(countPassedZeros(initial, direction, turns)).toEqual(expected);
	},
);
