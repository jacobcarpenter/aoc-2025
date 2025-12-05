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
