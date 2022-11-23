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
import TableMaestroCodigos from "../../../../app/components/modules/TableMaestroCodigos";
import TemplateMaestroCodigos from "../../../../app/components/templates/mantenimiento/TemplateMaestroCodigos";
import { useModal } from "../../../../app/hooks/useModal";
import { familias } from "../../../../data/familias";

export default function Familias() {
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
			{ Header: "Descripción", accessor: "descripcion" },
		],
		[]
	);

	const data = useMemo(() => familias, []);

	return (
		<>
			<TemplateMaestroCodigos>
				<Title text={"Lista Familias"}>
					<div className="flex gap-4">
						<ButtonImportData />
						<ButtonAdd
							text={"Nueva familia"}
							onClick={() => openModal(false)}
						/>
					</div>
				</Title>
				{/* Table list */}
				<TableMaestroCodigos
					columns={columns}
					data={data}
					openModal={openModal}
					setIsOpenModalDelete={setIsOpenModalDelete}
				/>
			</TemplateMaestroCodigos>
			{/* Modal agregar */}
			<Modal
				title={isEdit ? "Editar familia" : "Nuevo familia"}
				isOpen={isOpenModal}
				closeModal={closeModal}
			>
				{/* Form */}
				<form className="flex flex-col gap-5">
					<Input label="Código" />
					<Input label="Descripción" />
					<div className="w-full flex justify-end gap-5">
						<ButtonCancel onClick={closeModal} />
						<ButtonSave onClick={saveData} />
					</div>
				</form>
			</Modal>
			{/* Modal Eliminar */}
			<ModalConfirmDelete
				title={"Eliminar familia"}
				isOpen={isOpenModalDelete}
				closeModal={() => setIsOpenModalDelete(false)}
			/>
		</>
	);
}
