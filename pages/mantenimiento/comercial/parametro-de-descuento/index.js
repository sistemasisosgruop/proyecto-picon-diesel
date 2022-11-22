import { Input } from "@material-tailwind/react";
import { useState } from "react";
import {
	ButtonEdit, ButtonSave,
} from "../../../../app/components/elements/Buttons";
import { Title } from "../../../../app/components/elements/Title";
import TemplateComercial from "../../../../app/components/templates/mantenimiento/TemplateComercial";

export default function ParametroDescuento() {

  const [isEdit, setIsEdit] = useState(false)
	
	return (
		<TemplateComercial>
			<Title text={"Parametro de descuento "}></Title>
			{/* Form */}
			<form className="flex gap-3">
				<p>Rango de descuento</p>
				<Input type="number" label="De" disabled={!isEdit} />
				<p>-</p>
				<Input type="number" label="A" disabled={!isEdit} />
				{isEdit ? (
					<ButtonSave onClick={()=>{
            setIsEdit(false);
            // TODO: save data
          }
          }/>
				) : (
					<ButtonEdit onClick={() => setIsEdit(true)} />
				)}
			</form>
		</TemplateComercial>
	);
}
