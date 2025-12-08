const file = Bun.file(`${import.meta.dir}/input.txt`);
const input = await file.text();
const linesRaw = input.split("\n");

const part1 = (function () {
	const [firstLine, ...rest] = linesRaw
		.map((line) => line.trim())
		.map((line) => line.split(/\s+/));

	return firstLine!
		.map((term, index) => [term, ...rest.map((line) => line[index])])
		.map((exp) => ({
			op: exp.at(-1) as "*" | "+",
			terms: exp.slice(0, -1).map((x) => Number(x)),
		}))
		.map(({ op, terms }) => terms.reduce(createEvaluator(op)))
		.reduce((acc, curr) => acc + curr);
})();

const part2 = (function () {
	const [firstLine, ...rest] = linesRaw.map((line) => line.split("").toReversed());

	return firstLine!
		.map((ch, index) => [ch, ...rest.map((line) => line[index])].join("").trim())
		.reduce(
			(acc, curr) =>
				curr === "" ? [...acc, []] : [...acc.slice(0, -1), [...acc.at(-1)!, curr]],
			[[]] as string[][],
		)
		.map((arr) =>
			arr.reduce(
				(acc, curr) =>
					/[+*]$/.test(curr) ?
						{
							op: curr.at(-1)! as "*" | "+",
							terms: [...acc.terms, Number(curr.slice(0, -1).trimEnd())],
						}
					:	{ ...acc, terms: [...acc.terms, Number(curr)] },
				{ op: "" as "*" | "+", terms: [] as number[] },
			),
		)
		.map(({ op, terms }) => terms.reduce(createEvaluator(op)))
		.reduce((acc, curr) => acc + curr);
})();

console.log({ part1, part2 });

function createEvaluator(op: "*" | "+") {
	return function (term1: number, term2: number) {
		return (
			op === "*" ? term1 * term2
			: op === "+" ? term1 + term2
			: NaN
		);
	};
}
