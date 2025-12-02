if (import.meta.main) {
	const file = Bun.file(`${import.meta.dir}/input.txt`);
	const input = await file.text();
	const lines = input.split("\n");
	const data = lines.map((line) => {
		const matched = line.match(/^(?<direction>[LR])(?<turns>\d+)$/)!;
		return {
			direction: matched.groups!.direction as "L" | "R",
			turns: Number(matched.groups!.turns!),
		};
	});

	const part1 = data.reduce(
		({ dial, zeros }, { direction, turns }) => {
			const value = rotateBy(dial, direction, turns);
			const zerosToAdd = value === 0 ? 1 : 0;
			return {
				dial: value,
				zeros: zeros + zerosToAdd,
			};
		},
		{ dial: 50, zeros: 0 },
	);

	const part2 = data.reduce(
		({ dial, zeros }, { direction, turns }) => {
			const value = rotateBy(dial, direction, turns);
			const zerosToAdd = countPassedZeros(dial, direction, turns);
			return {
				dial: value,
				zeros: zeros + zerosToAdd,
			};
		},
		{ dial: 50, zeros: 0 },
	);

	console.log({
		part1: part1.zeros,
		part2: part2.zeros,
	});
}

export function rotateBy(initial: number, direction: "L" | "R", turns: number) {
	const rotationAdjustment = (turns % 100) * (direction === "L" ? -1 : 1);
	return (initial + rotationAdjustment + 100) % 100;
}

export function countPassedZeros(initial: number, direction: "L" | "R", turns: number) {
	const distanceToZero = (direction === "L" ? initial : 100 - initial) % 100;
	return (
		distanceToZero > turns ? 0
		: distanceToZero === 0 ? Math.trunc(turns / 100)
		: Math.trunc((turns - distanceToZero) / 100) + 1
	);
}
