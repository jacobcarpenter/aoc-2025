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
);

const part1 = enumerateGrid(seq(grid.height), seq(grid.width))
	.filter(({ x, y }) => isAccessible(grid, x, y))
	.reduce((acc) => acc + 1, 0);

const part2 = (function recursivelyRemoveAccessible(grid: Grid<string>, totalRemoved = 0): number {
	const { nextGrid, removed } = enumerateGrid(seq(grid.height), seq(grid.width))
		.filter(({ x, y }) => isAccessible(grid, x, y))
		.reduce(
			(acc, { x, y }) => ({
				nextGrid: setCell(acc.nextGrid, x, y, "x"),
				removed: acc.removed + 1,
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
	yield* enumerateGrid(range(-1, 1), range(-1, 1))
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

function* enumerateGrid(ys: () => Generator<number>, xs: () => Generator<number>) {
	yield* ys().flatMap((y) => xs().map((x) => ({ x, y })));
}

function seq(length: number, start = 0, step = 1) {
	return function* () {
		for (let value = start; value < length; value += step) {
			yield value;
		}
	};
}

function range(start: number, end: number, step = 1) {
	return function* () {
		for (let value = start; value <= end; value += step) {
			yield value;
		}
	};
}
