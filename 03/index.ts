if (import.meta.main) {
	const file = Bun.file(`${import.meta.dir}/input.txt`);
	const input = await file.text();
	const lines = input.split("\n");

	const data = lines.map((line) => line.split("").map((x) => Number(x)));

	const part1 = data
		.map((bank) => {
			const { value: tensValue, valueIndex: tensIndex } = bank
				.slice(0, -1)
				.reduce(
					(acc, value, valueIndex) => (value > acc.value ? { value, valueIndex } : acc),
					{ value: -1, valueIndex: -1 },
				);
			const ones = bank.slice(tensIndex + 1).reduce((acc, curr) => (curr > acc ? curr : acc));
			return tensValue * 10 + ones;
		})
		.reduce((acc, curr) => acc + curr);

	const part2 = data
		.map((bank) => {
			const { digits } = Array.from<undefined>({ length: 12 }).reduce(
				({ digits, start }, _, index, { length }) => {
					const { value, valueIndex } = bank
						.slice(start, -(length - 1 - index) || undefined)
						.reduce(
							(acc, value, valueIndex) =>
								value > acc.value ? { value, valueIndex } : acc,
							{ value: -1, valueIndex: -1 },
						);
					return { digits: [...digits, value], start: start + valueIndex + 1 };
				},
				{ digits: [] as number[], start: 0 },
			);

			return digits.reduce(
				(acc, curr, index, { length }) => acc + Math.pow(10, length - 1 - index) * curr,
				0,
			);
		})
		.reduce((acc, curr) => acc + curr);

	console.log({
		part1,
		part2,
	});
}
