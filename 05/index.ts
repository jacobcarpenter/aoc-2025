import { createParser } from "../utility";

if (import.meta.main) {
	const file = Bun.file(`${import.meta.dir}/input.txt`);
	const input = await file.text();
	const [freshRangesInput, ingredientIdsInput] = input.split("\n\n");

	const freshRanges = freshRangesInput!
		.split("\n")
		.map(createParser(/(?<start>\d+)-(?<end>\d+)/, { start: Number, end: Number }));

	const ingredientIds = ingredientIdsInput!
		.split("\n")
		.map((x) => Number(x))
		.toSorted((a, z) => a - z);

	const part1 =
		ingredientIds.length -
		freshRanges.reduce(
			(acc, { start, end }) => {
				const { index: startIndex } = search(acc, start);
				const { index: endIndex, found: endFound } = search(acc, end);

				return acc.toSpliced(startIndex, endIndex - startIndex + (endFound ? 1 : 0));
			},
			[...ingredientIds],
		).length;

	const part2_a = freshRanges.slice(1).reduce(
		({ starts, ends }, { start, end }) => {
			const { index: startingRangeIndex } = search(ends, start - 1);

			const { index: endInStarts, found: endFound } = search(starts, end + 1);
			const endingRangeIndex = endFound ? endInStarts : endInStarts - 1;

			if (startingRangeIndex <= endingRangeIndex) {
				const newStart = Math.min(start, starts[startingRangeIndex]!);
				const newEnd = Math.max(end, ends[endingRangeIndex]!);

				const removeCount = endingRangeIndex - startingRangeIndex + 1;

				return {
					starts: starts.toSpliced(startingRangeIndex, removeCount, newStart),
					ends: ends.toSpliced(startingRangeIndex, removeCount, newEnd),
				};
			}

			return {
				starts: starts.toSpliced(startingRangeIndex, 0, start),
				ends: ends.toSpliced(startingRangeIndex, 0, end),
			};
		},
		{
			starts: [freshRanges[0]!.start],
			ends: [freshRanges[0]!.end],
		},
	);

	const part2 = part2_a.starts
		.map((start, index) => ({ start, end: part2_a.ends[index]! }))
		.reduce((acc, { start, end }) => acc + (end - start + 1), 0);

	console.log({ part1, part2 });
}

export function search(values: number[], value: number) {
	let start = 0;
	let end = values.length;

	while (start !== end) {
		let midpoint = start + Math.trunc((end - start) / 2);
		if (values[midpoint] === value) {
			return { found: true, index: midpoint };
		}

		if (values[midpoint]! < value) {
			start = midpoint + 1;
		} else {
			end = midpoint;
		}
	}

	return { found: false, index: start };
}
