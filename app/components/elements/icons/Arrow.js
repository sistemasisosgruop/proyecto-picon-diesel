export const ArrowRightFast = (props) => {
  return (
		<svg
			width={32}
			height={32}
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			color="currentColor"
			{...props}
		>
			<path
				d="m13 6 6 6-6 6M5 6l6 6-6 6"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
  );
}

export const ArrowLeftFast = (props) => {
  return (
		<svg
			width={32}
			height={32}
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			color="currentColor"
			{...props}
		>
			<path
				d="m11 6-6 6 6 6m8-12-6 6 6 6"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
  );
}