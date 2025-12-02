// TODO: plan on extracting this to a shared helper function for each problem
const file = Bun.file(`${import.meta.dir}/input.txt`);
const input = await file.text();
const lines = input.split("\n");

const part1 = lines
	.map((line) => {
		const matched = line.match(/^(?<direction>[LR])(?<turns>\d+)$/)!;
		return {
			direction: matched.groups!.direction as "L" | "R",
			turns: parseInt(matched.groups!.turns!),
		};
	})
	.reduce(
		({ dial, zeros }, { direction, turns }) => {
			const nextDial = rotateBy(dial, direction, turns);
			const nextZeros = zeros + (nextDial === 0 ? 1 : 0);

			return {
				dial: nextDial,
				zeros: nextZeros,
			};
		},
		{ dial: 50, zeros: 0 },
	);

console.log(part1);

function rotateBy(initial: number, direction: "L" | "R", turns: number) {
	const raw = initial + (direction === "L" ? -turns : turns);
	return (raw + 100 * (Math.trunc(raw / 100) + 1)) % 100;
}
