/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primary: {
					50: "#f5f6fa",
					100: "#e9eaf5",
					200: "#cfd3e8",
					300: "#a5aed4",
					400: "#7483bc",
					500: "#5263a5",
					600: "#3f4c8a",
					700: "#343e70",
					800: "#2e365e",
					DEFAULT: "#171a2b",
				},
				secundary: {
					50: "#ffffea",
					100: "#fffbc5",
					200: "#fff885",
					300: "#ffee46",
					400: "#ffdf1b",
					DEFAULT: "#ffc107",
					600: "#e29400",
					700: "#bb6902",
					800: "#985108",
					900: "#7c420b",
				},
			},
		},
	},
	plugins: [],
});
