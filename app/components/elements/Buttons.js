import { Tooltip } from "@material-tailwind/react";
import { Add, Edit, TrushSquare } from "iconsax-react";
import Link from "next/link";
import { useState } from "react";
import { Excel } from "./icons/Excel";

export const ButtonAdd = ({ text, onClick }) => {
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

export const ButtonEdit = ({ onClick }) => {
  return (
		<Tooltip content="Editar" className="bg-white text-primary-800 shadow">
			<button
				type="button"
				className="flex justify-center items-center p-[6px] bg-primary-50 shadow text-primary-500 hover:text-primary-800 rounded-lg cursor-pointer hover:bg-primary-100 "
				onClick={onClick}
			>
				<Edit />
			</button>
		</Tooltip>
  );
};

export const ButtonDelete = ({ onClick }) => {
  return (
		<Tooltip
			content="Eliminar"
			className="bg-white text-primary-600 shadow"
		>
			<button
				type="button"
				className="flex justify-center items-center p-[6px] bg-primary-100 shadow text-primary-500 hover:text-primary-800 rounded-lg cursor-pointer hover:bg-primary-200"
				onClick={onClick}
			>
				<TrushSquare />
			</button>
		</Tooltip>
  );
};

export const ButtonSave = ({onClick}) => {
	return (
		<button
			type="button"
			className="flex justify-center items-center p-[10px] gap-1 bg-secundary text-primary rounded-lg cursor-pointer hover:bg-secundary-800 shadow-md"
			onClick={onClick}
		>
			Guardar
		</button>
	);
}
export const ButtonCancel = ({onClick}) => {
	return (
		<button
			type="button"
			className="flex justify-center items-center p-[10px] gap-1 bg-primary-50 shadow-md text-primary rounded-lg cursor-pointer hover:bg-primary-100"
			onClick={onClick}
		>
			Cancelar
		</button>
	);
}

export const ButtonImportData = () => {

	const [fileExcel, setfileExcel] = useState(null);

	const handleFile = (e) => {
		setfileExcel(e.target.files[0]);
	}

	return (
		<>
			<input
				type="file"
				name="excel"
				id="excel"
				className="w-0 h-0 opacity-0 overflow-hidden absolute z-[-1]"
				accept=".xlsx, .xls, .csv"
				onChange={(e) => handleFile(e)}
			/>
			<label
				htmlFor="excel"
				className=" flex justify-center items-center p-[10px] gap-1 bg-primary-50 shadow-md text-primary rounded-lg cursor-pointer hover:bg-primary-100"
			>
				<Excel />
				<p className="max-w-xs text-ellipsis whitespace-nowrap overflow-hidden">
					{fileExcel ? fileExcel.name : "Importar data"}
				</p>
			</label>
		</>
	);
}

export const ButtonSubfamilia = ({link}) => {
	return (
		<Link
			href={link}
			type="button"
			className="flex justify-center items-center p-[10px] gap-1 bg-primary-300 shadow-md text-primary-700 rounded-lg cursor-pointer hover:bg-primary hover:text-white transition-colors"
		>
			Subfamilia
		</Link>
	);
}