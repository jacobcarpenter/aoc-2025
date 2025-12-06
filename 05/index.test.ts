import { test, expect, describe } from "bun:test";
import { search } from ".";

describe("search", () => {
	test.each<{ arr: number[]; target: number; found: boolean; index: number }>([
		{ arr: [1, 2, 3, 4, 5], target: 3, found: true, index: 2 },
		{ arr: [1, 2, 3, 4, 5], target: 1, found: true, index: 0 },
		{ arr: [1, 2, 3, 4, 5], target: 5, found: true, index: 4 },
	])("find $target => $index", ({ arr, target, found, index }) => {
		expect(search(arr, target)).toEqual({ found, index });
	});

	test.each<{ arr: number[]; target: number; found: boolean; index: number }>([
		{ arr: [2, 4, 6, 8], target: 5, found: false, index: 2 },
		{ arr: [2, 4, 6, 8], target: 1, found: false, index: 0 },
		{ arr: [2, 4, 6, 8], target: 9, found: false, index: 4 },
	])("not found $target => $index", ({ arr, target, found, index }) => {
		expect(search(arr, target)).toEqual({ found, index });
	});
});
