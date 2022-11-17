import { Tooltip } from "@material-tailwind/react";
import { Add, Edit, TrushSquare } from "iconsax-react";

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
    <Tooltip content="Editar" className="bg-white text-primary-600 shadow">
      <button
        type="button"
        className="flex justify-center items-center p-[6px] bg-primary-100 shadow text-primary-800 rounded-lg cursor-pointer hover:bg-primary-200"
        onClick={onClick}
      >
        <Edit />
      </button>
    </Tooltip>
  );
};

export const ButtonDelete = ({ onClick }) => {
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
};
