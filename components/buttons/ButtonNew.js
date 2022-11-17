import { Add } from "iconsax-react";

export const ButtonNew = ({ text, onClick }) => {
	return (
		<button
			type="button"
			className="flex justify-center items-center p-[10px] gap-1 bg-secundary text-primary rounded-lg cursor-pointer hover:bg-secundary-800"
			onClick={onClick}
		>
			<Add />
			{text}
		</button>
	);
};
