export function createParser<TExtractor extends Record<string, (value: string) => any>>(
	pattern: RegExp,
	extractor: TExtractor,
) {
	return function (value: string) {
		const matched = value.match(pattern)!;
		return Object.fromEntries(
			Object.entries(extractor).map(([propertyName, projection]) => {
				return [propertyName, projection(matched.groups![propertyName]!)];
			}),
		) as { [K in keyof TExtractor]: ReturnType<TExtractor[K]> };
	};
}

export function repeat<T>(times: number, value: T | undefined = undefined) {
	return function* () {
		for (let i = 0; i < times; ++i) {
			yield value;
		}
	};
}

export function seq(length: number, start = 0, step = 1) {
	return function* () {
		for (let value = start; value < length; value += step) {
			yield value;
		}
	};
}

export function range(start: number, end: number, step = 1) {
	return function* () {
		for (let value = start; value <= end; value += step) {
			yield value;
		}
	};
}
