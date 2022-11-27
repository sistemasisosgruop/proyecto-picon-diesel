import { Input } from "@material-tailwind/react";
import { useMemo } from "react";
import {
	ButtonAdd,
	ButtonCancel,
	ButtonImportData,
	ButtonSave,
} from "../../../../../../app/components/elements/Buttons";
import { Title } from "../../../../../../app/components/elements/Title";
import {
	Modal,
	ModalConfirmDelete,
} from "../../../../../../app/components/modules/Modal";
import TableComplete from "../../../../../../app/components/modules/TableComplete";
import { TemplateConfiguracionMaquinas } from "../../../../../../app/components/templates/mantenimiento/maestro-codigos/TemplateConfiguracionMaquinas";
import TemplateMaestroCodigos from "../../../../../../app/components/templates/mantenimiento/TemplateMaestroCodigos";
import { useModal } from "../../../../../../app/hooks/useModal";
import { modelosMaquinas } from "../../../../../../data/configuracion-maquinas-modelos";

export default function NombresMaquina() {
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
			{ Header: "Nombre", accessor: "modelo" },
		],
		[]
	);

	const data = useMemo(() => modelosMaquinas, []);

	return (
		<>
			<TemplateMaestroCodigos>
				<TemplateConfiguracionMaquinas>
					<Title text={"Nombres de Máquinas"}>
						<div className="flex gap-4">
							<ButtonImportData />
							<ButtonAdd
								text={"Nuevo nombre"}
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
				</TemplateConfiguracionMaquinas>
			</TemplateMaestroCodigos>
			{/* Modal agregar */}
			<Modal
				title={
					isEdit ? "Editar Nombre Máquina" : "Nueva Nombre Máquina"
				}
				isOpen={isOpenModal}
				closeModal={closeModal}
			>
				{/* Form */}
				<form className="flex flex-col gap-5">
					<Input label="Código" />
					<Input label="Nombre" />
					<div className="w-full flex justify-end gap-5">
						<ButtonCancel onClick={closeModal} />
						<ButtonSave onClick={saveData} />
					</div>
				</form>
			</Modal>
			{/* Modal Eliminar */}
			<ModalConfirmDelete
				title={"Eliminar Nombre"}
				isOpen={isOpenModalDelete}
				closeModal={() => setIsOpenModalDelete(false)}
			/>
		</>
	);
}
