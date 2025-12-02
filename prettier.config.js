/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
	useTabs: true,
	tabWidth: 4,
	printWidth: 100,
	overrides: [
		{
			files: ["*.y?(a)ml"],
			options: {
				useTabs: false,
				tabWidth: 2,
			},
		},
	],
};

export default config;
