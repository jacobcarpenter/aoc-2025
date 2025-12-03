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
	const numberString = value.toString();
	return (
		numberString.length % 2 === 0 &&
		numberString.substring(0, numberString.length / 2) ===
			numberString.substring(numberString.length / 2)
	);
}

export function isInvalid2(value: number) {
	const numberString = value.toString();
	for (let end = Math.trunc(numberString.length / 2); end > 0; --end) {
		if (RegExp(`^(${RegExp.escape(numberString.substring(0, end))}){2,}$`).test(numberString)) {
			return true;
		}
	}

	return false;
}
