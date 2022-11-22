import { Input } from "@material-tailwind/react";
import { useMemo } from "react";
import {
	ButtonAdd,
	ButtonCancel,
	ButtonSave,
} from "../../../../app/components/elements/Buttons";
import { Title } from "../../../../app/components/elements/Title";
import {
	Modal,
	ModalConfirmDelete,
} from "../../../../app/components/modules/Modal";
import TableComplete from "../../../../app/components/modules/TableComplete";
import TemplateComercial from "../../../../app/components/templates/mantenimiento/TemplateComercial";
import { useModal } from "../../../../app/hooks/useModal";
import { detracciones } from "../../../../data/detracciones";

export default function Detracciones() {
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
			{ Header: "Definición", accessor: "definicion" },
			{ Header: "Porcentaje", accessor: "porcentaje" },
		],
		[]
	);

	const data = useMemo(() => detracciones, []);

	return (
		<>
			<TemplateComercial>
				<Title text={"Lista Detracciones"}>
					<div className="flex gap-4">
						<ButtonAdd
							text={"Nuevo detraccion"}
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
			</TemplateComercial>
			{/* Modal agregar */}
			<Modal
				title={
					isEdit
						? "Editar Detracción"
						: "Nuevo Detracción"
				}
				isOpen={isOpenModal}
				closeModal={closeModal}
			>
				{/* Form */}
				<form className="flex flex-col gap-5">
					<Input label="Código" />
					<div className="flex gap-5">
						<Input label="Nombre" />
						<Input label="Abreviatura" />
					</div>
					<div className="w-full flex justify-end gap-5">
						<ButtonCancel onClick={closeModal} />
						<ButtonSave onClick={saveData} />
					</div>
				</form>
			</Modal>
			{/* Modal Eliminar */}
			<ModalConfirmDelete
				title={"Eliminar Detracción"}
				isOpen={isOpenModalDelete}
				closeModal={() => setIsOpenModalDelete(false)}
			/>
		</>
	);
}
