import { Input } from "@material-tailwind/react";
import { useMemo } from "react";
import {
	ButtonAdd,
	ButtonCancel,
	ButtonImportData,
	ButtonSave,
} from "../../../../app/components/elements/Buttons";
import { Title } from "../../../../app/components/elements/Title";
import {
	Modal,
	ModalConfirmDelete,
} from "../../../../app/components/modules/Modal";
import TableComplete from "../../../../app/components/modules/TableComplete";
import TemplateInventario from "../../../../app/components/templates/TemplateInventario";
import { useModal } from "../../../../app/hooks/useModal";
import { choferes } from "../../../../data/choferes";

export default function Choferes() {
	const {
		isOpenModal,
		isOpenModalDelete,
		isEdit,
		setIsOpenModalDelete,
		closeModal,
		openModal,
	} = useModal();

	const saveData = () => {
		closeModal();
	};

	const columns = useMemo(
		() => [
			{ Header: "#", accessor: "id" },
			{ Header: "Codigo", accessor: "codigo" },
      { Header: "Nombre", accessor: "nombre" },
      { Header: "DNI", accessor: "dni" },
      { Header: "Telefono", accessor: "telefono" },
      { Header: "Correo", accessor: "correo" },
      { Header: "Licencia", accessor: "licencia" },
      { Header: "Fecha Vencimiento", accessor: "fechaVencimiento" }
		],
		[]
	);

	const data = useMemo(() => choferes, []);

  

	return (
		<>
			<TemplateInventario>
				<Title text={"Lista Choferes"}>
					<div className="flex gap-4">
						<ButtonImportData />
						<ButtonAdd
							text={"Nuevo chofer"}
							onClick={() => openModal(false)}
						/>
					</div>
				</Title>
				{/* Table list */}
				<TableComplete
					columns={columns}
					data={data}
					openModal={openModal}
					setIsOpenModalDelete={setIsOpenModalDelete}
				/>
			</TemplateInventario>
			{/* Modal agregar */}
			<Modal
				title={isEdit ? "Editar chofer" : "Nuevo chofer"}
				isOpen={isOpenModal}
				closeModal={closeModal}
			>
				{/* Form */}
				<form className="flex flex-col gap-5">
					<Input label="Nombre" />
					<div className="flex gap-5">
						<Input label="DNI" />
						<Input label="Licencia" />
					</div>
					<div className="flex gap-5">
						<Input label="Fecha de vencimiento" type="date" />
						<Input label="Tarjeta de propiedad" />
					</div>
					<div className="flex gap-5">
						<Input label="Teléfono" />
						<Input label="Correo" />
					</div>
					<div className="w-full flex justify-end gap-5">
						<ButtonCancel onClick={closeModal} />
						<ButtonSave onClick={saveData} />
					</div>
				</form>
			</Modal>
			{/* Modal Eliminar */}
			<ModalConfirmDelete
				title={"Eliminar Chofer"}
				isOpen={isOpenModalDelete}
				closeModal={() => setIsOpenModalDelete(false)}
			/>
		</>
	);
}
