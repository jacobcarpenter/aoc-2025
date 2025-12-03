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
		.filter(isInvalid)
		.reduce((acc, curr) => acc + BigInt(curr), BigInt(0));

	console.log({ part1 });
}

function isInvalid(value: number) {
	const numberString = value.toString();
	return (
		numberString.length % 2 === 0 &&
		numberString.substring(0, numberString.length / 2) ===
			numberString.substring(numberString.length / 2)
	);
}

function enumerateRange({ start, end }: { start: number; end: number }) {
	return Array.from({ length: end - start }, (_, i) => i + start);
}
