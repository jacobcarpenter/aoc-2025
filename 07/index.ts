const file = Bun.file(`${import.meta.dir}/input.txt`);
const input = await file.text();
const lines = input.split("\n").map((line) => line.split(""));

const part1 = lines.slice(1).reduce(
	(acc, curr) => {
		const { splits, nextLine } = curr.reduce(
			({ splits, nextLine }, ch, index) =>
				ch === "." && acc.lastLine[index] === "S" ?
					{ splits, nextLine: [...nextLine, "|"] } // start
				: ch === "^" && acc.lastLine[index] === "|" ?
					{ splits: splits + 1, nextLine: [...nextLine, ch] } // increment split count
				: ch === "." && curr[index + 1] === "^" && acc.lastLine[index + 1] === "|" ?
					{ splits, nextLine: [...nextLine, "|"] } // propagate to left of splitter
				: ch === "." && curr[index - 1] === "^" && acc.lastLine[index - 1] === "|" ?
					{ splits, nextLine: [...nextLine, "|"] } // propagate to right of splitter
				: ch === "." && acc.lastLine[index] === "|" ?
					{ splits, nextLine: [...nextLine, "|"] } // propagate from above
				:	{ splits, nextLine: [...nextLine, ch] },
			{ splits: 0, nextLine: [] as string[] },
		);

		return { lastLine: nextLine, splits: acc.splits + splits };
	},
	{ lastLine: lines[0]!, splits: 0 },
);

const part2 = (function processTimelines(
	{ lineIndex, lastLine }: { lineIndex: number; lastLine: string[] },
	timelineCount: number,
	memo = new Map<string, number>(),
): number {
	if (lineIndex === lines.length) {
		return timelineCount;
	}

	// looking forward to something like https://github.com/tc39/proposal-composites
	const particlePosition = lastLine.indexOf("|");
	const cacheKey = `${lineIndex},${particlePosition}`;
	if (memo.has(cacheKey)) {
		return memo.get(cacheKey)!;
	}

	const nextState = { lineIndex: lineIndex + 1 };

	const currentLine = lines[lineIndex]!;
	const activeSplitter = currentLine[particlePosition] === "^";

	const result =
		activeSplitter ?
			// I happen to know no splitters appear on the extreme edge of the data set...
			// (otherwise, we'd need to check if activeSplitter +/- 1 resulted in line over/underflow)
			processTimelines(
				{ ...nextState, lastLine: currentLine.toSpliced(particlePosition - 1, 1, "|") },
				timelineCount,
				memo,
			) +
			processTimelines(
				{ ...nextState, lastLine: currentLine.toSpliced(particlePosition + 1, 1, "|") },
				timelineCount,
				memo,
			)
			// no split; propagate particle vertically
		:	processTimelines(
				{ ...nextState, lastLine: currentLine.toSpliced(particlePosition, 1, "|") },
				timelineCount,
				memo,
			);

	memo.set(cacheKey, result);
	return result;
})({ lineIndex: 2, lastLine: lines[1]!.toSpliced(lines[0]!.indexOf("S"), 1, "|") }, 1);

console.log({ part1: part1.splits, part2 });
