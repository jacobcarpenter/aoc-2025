import { createParser } from "../utility";

const connectionLimits = {
	sample: 10,
	input: 1000,
};

const filename = "sample";
const file = Bun.file(`${import.meta.dir}/${filename}.txt`);

const input = await file.text();

const junctionBoxes = input.split("\n").map(
	createParser(/(?<x>\d+),(?<y>\d+),(?<z>\d+)/, {
		x: Number,
		y: Number,
		z: Number,
	}),
);

const circuitConnections = junctionBoxes
	.reduce((acc, curr, index) => {
		for (const { paired, offset } of junctionBoxes
			.slice(index + 1)
			.map((paired, offsetIndex) => ({ paired, offset: offsetIndex + index + 1 }))) {
			acc.set(
				`${index}:${offset}`,
				Math.sqrt(
					(curr.x - paired.x) ** 2 + (curr.y - paired.y) ** 2 + (curr.z - paired.z) ** 2,
				),
			);
		}

		return acc;
	}, new Map<string, number>()) // all pairings w/ distances
	.entries()
	.toArray()
	.toSorted(([, distA], [, distZ]) => distA - distZ) // sorted by closest
	.map(([key, value]) => {
		const [firstId, secondId] = key.split(":").map((x) => Number(x));
		return {
			firstId: firstId!,
			secondId: secondId!,
			first: junctionBoxes[firstId!],
			second: junctionBoxes[secondId!],
			distance: value,
		};
	}); // mapped to a pairing descriptor with indexes, coordinate values, and distance

const part1 = (function () {
	const junctionCircuits = Array.from({ length: junctionBoxes.length }, (_, i) => i + 1);

	for (const connection of circuitConnections.slice(0, connectionLimits[filename])) {
		const firstCiruitId = junctionCircuits[connection.firstId]!;
		const secondCircuitId = junctionCircuits[connection.secondId]!;

		for (let i = 0; i < junctionCircuits.length; ++i) {
			if (junctionCircuits[i] === secondCircuitId) {
				junctionCircuits[i] = firstCiruitId;
			}
		}
	}

	const biggestCircuits = junctionCircuits
		.reduce((acc, curr) => acc.set(curr, (acc.get(curr) ?? 0) + 1), new Map<number, number>())
		.entries()
		.toArray()
		.toSorted(([, sizeA], [, sizeZ]) => sizeZ - sizeA);

	return biggestCircuits.slice(0, 3).reduce((acc, [, curr]) => acc * curr, 1);
})();

const part2 = (function () {
	const junctionCircuits = Array.from({ length: junctionBoxes.length }, (_, i) => i + 1);

	let finalConnection: (typeof circuitConnections)[number];
	for (const connection of circuitConnections) {
		const firstCiruitId = junctionCircuits[connection.firstId]!;
		const secondCircuitId = junctionCircuits[connection.secondId]!;

		for (let i = 0; i < junctionCircuits.length; ++i) {
			if (junctionCircuits[i] === secondCircuitId) {
				junctionCircuits[i] = firstCiruitId;
			}
		}

		if (junctionCircuits.every((x) => x === junctionCircuits[0])) {
			finalConnection = connection;
			break;
		}
	}

	return finalConnection!.first!.x * finalConnection!.second!.x;
})();

console.log({ part1, part2 });
