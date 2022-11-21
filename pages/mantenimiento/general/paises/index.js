import { Input } from "@material-tailwind/react";
import { useMemo } from "react";
import {
	ButtonAdd,
	ButtonCancel,
	ButtonSave,
} from "../../../../app/components/elements/Buttons";
import { Title } from "../../../../app/components/elements/Title";
import {
	ModalConfirmDelete,
	Modal,
} from "../../../../app/components/modules/Modal";
import TableComplete from "../../../../app/components/modules/TableComplete";
import TemplateGeneral from "../../../../app/components/templates/TemplateGeneral";
import { useModal } from "../../../../app/hooks/useModal";
import { paises } from "../../../../data/paises";

export default function Paises() {
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

	// Datos de los paises
	const columns = useMemo(
		() => [
			{ Header: "#", accessor: "id" },
			{ Header: "Codigo", accessor: "codigo" },
			{ Header: "Nombre", accessor: "nombre" },
		],
		[]
	);

	const data = useMemo(() => paises, []);
	

	return (
		<>
			<TemplateGeneral>
				<Title text={"Lista Países"}>
					<ButtonAdd
						text={"Nuevo País"}
						onClick={() => openModal(false)}
					/>
				</Title>
				
				{/* Table List */}
				<TableComplete columns={columns} data={data} openModal={openModal} setIsOpenModalDelete={setIsOpenModalDelete} />

				
			</TemplateGeneral>
			{/* Modal agregar */}
			<Modal
				title={isEdit ? "Editar Pais" : "Nuevo Pais"}
				isOpen={isOpenModal}
				closeModal={closeModal}
			>
				{/* Form */}
				<form className="flex flex-col gap-5">
					<Input label="Codigo" />
					<Input label="Nombre" />
					<div className="w-full flex justify-end gap-5">
						<ButtonCancel onClick={closeModal} />
						<ButtonSave onClick={saveData} />
					</div>
				</form>
			</Modal>
			{/* Modal Eliminar */}
			<ModalConfirmDelete
				title={"Eliminar País"}
				isOpen={isOpenModalDelete}
				closeModal={() => setIsOpenModalDelete(false)}
			/>
		</>
	);
}
