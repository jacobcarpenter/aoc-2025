import { createParser } from "../utility";

if (import.meta.main) {
	const file = Bun.file(`${import.meta.dir}/input.txt`);
	const input = await file.text();

	const data = input.split(",").map(
		createParser(/^(?<start>\d+)-(?<end>\d+)$/, {
			start: Number,
			end: Number,
		}),
	);

	const part1 = data
		.flatMap(enumerateRange)
		.filter(isInvalid1)
		.reduce((acc, curr) => acc + curr, 0);

	const part2 = data
		.flatMap(enumerateRange)
		.filter(isInvalid2)
		.reduce((acc, curr) => acc + curr, 0);

	console.log({ part1, part2 });

	function enumerateRange({ start, end }: { start: number; end: number }) {
		return Array.from({ length: end - start }, (_, i) => i + start);
	}
}

export function isInvalid1(value: number) {
	const numbers = value.toString();
	return (
		numbers.length % 2 === 0 &&
		numbers.substring(0, numbers.length / 2) === numbers.substring(numbers.length / 2)
	);
}

export function isInvalid2(value: number) {
	const numbers = value.toString();
	for (let end = Math.trunc(numbers.length / 2); end > 0; --end) {
		if (RegExp(`^(${RegExp.escape(numbers.substring(0, end))}){2,}$`).test(numbers)) {
			return true;
		}
	}

	return false;
}
