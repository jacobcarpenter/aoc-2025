type Grid<T> = { cells: T[]; width: number; height: number };

const file = Bun.file(`${import.meta.dir}/input.txt`);
const input = await file.text();
const grid = input.split("\n").reduce(
	({ cells, width }, line, rowNumber) => {
		return {
			cells: [...cells, ...line.split("")],
			width: width || line.length,
			height: rowNumber + 1,
		};
	},
	{ cells: [] as string[], width: 0, height: 0 },
) satisfies Grid<string>;

const part1 = enumerateGridCoordinates(seq(grid.height), seq(grid.width))
	.filter(({ x, y }) => isAccessible(grid, x, y))
	.reduce((acc) => acc + 1, 0);

const part2 = (function recursivelyRemoveAccessible(grid: Grid<string>, totalRemoved = 0): number {
	const { nextGrid, removed } = enumerateGridCoordinates(seq(grid.height), seq(grid.width))
		.filter(({ x, y }) => isAccessible(grid, x, y))
		.reduce(
			({ nextGrid, removed }, { x, y }) => ({
				nextGrid: setCell(nextGrid, x, y, "x"),
				removed: removed + 1,
			}),
			{ nextGrid: grid, removed: 0 },
		);

	return removed === 0 ? totalRemoved : (
			recursivelyRemoveAccessible(nextGrid, totalRemoved + removed)
		);
})(grid);

console.log({ part1, part2 });

function isAccessible(grid: Grid<string>, x: number, y: number) {
	return (
		getCell(grid, x, y) === "@" &&
		getNeighbors(grid, x, y)
			.filter((curr) => curr === "@")
			.reduce((acc) => acc + 1, 0) < 4
	);
}

function* getNeighbors<T>(grid: Grid<T>, x: number, y: number) {
	yield* enumerateGridCoordinates(range(-1, 1), range(-1, 1))
		.filter(({ x, y }) => !(x === 0 && y === 0))
		.map(({ x: offsetX, y: offsetY }) => getCell(grid, offsetX + x, offsetY + y));
}

function getCell<T>({ cells, width, height }: Grid<T>, x: number, y: number) {
	if (x < 0 || x >= width || y < 0 || y >= height) {
		return undefined;
	}

	return cells[y * width + x];
}

function setCell<T>({ cells, width, height }: Grid<T>, x: number, y: number, value: T) {
	if (x < 0 || x >= width || y < 0 || y >= height) {
		return { cells, width, height };
	}

	return { cells: cells.toSpliced(y * width + x, 1, value), width, height };
}

function* enumerateGridCoordinates(ys: () => Generator<number>, xs: () => Generator<number>) {
	yield* ys().flatMap((y) => xs().map((x) => ({ x, y })));
}

function seq(length: number, start = 0, step = 1) {
	return function* () {
		let offset = 0;
		while (offset < length) {
			yield start + offset;
			offset += step;
		}
	};
}

function range(start: number, end: number, step = 1) {
	return function* () {
		let value = start;
		while (value <= end) {
			yield value;
			value += step;
		}
	};
}
