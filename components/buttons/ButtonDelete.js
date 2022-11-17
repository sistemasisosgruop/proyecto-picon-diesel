import { Tooltip } from "@material-tailwind/react";
import { TrushSquare } from "iconsax-react";

export const ButtonDelete = ({onClick}) => {
  return (
		<Tooltip content="Eliminar" className="bg-white text-primary-600 shadow">
			<button
				type="button"
				className="flex justify-center items-center p-[6px] bg-primary-100 shadow text-primary-800 rounded-lg cursor-pointer hover:bg-primary-200"
				onClick={onClick}
			>
				<TrushSquare />
			</button>
		</Tooltip>
  );
}