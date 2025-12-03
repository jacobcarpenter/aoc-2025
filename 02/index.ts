import { createParser } from "../utility";

if (import.meta.main) {
	const file = Bun.file(`${import.meta.dir}/sample.txt`);
	const input = await file.text();

	const data = input.split(",").map(
		createParser(/^(?<start>\d+)-(?<end>\d+)$/, {
			start: Number,
			end: Number,
		}),
	);

	console.log(data);
}
