import { Input, Option, Select } from "@material-tailwind/react";
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
import TemplateAdministrativo from "../../../../app/components/templates/TemplateAdministrativo";
import { useModal } from "../../../../app/hooks/useModal";
import { clientes } from "../../../../data/clientes";

export default function Clientes() {
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
			{ Header: "Tipo Documento", accessor: "tipoDocumento" },
			{ Header: "N° de documento", accessor: "numeroDocumento" },
			{ Header: "Teléfono", accessor: "telefono" },
			{ Header: "Correo", accessor: "correo" },
			{ Header: "Estado", accessor: "estado" },
		],
		[]
	);

	const data = useMemo(() => clientes, []);

	return (
		<>
			<TemplateAdministrativo>
				<Title text={"Lista Clientes"}>
					<div className="flex gap-4">
						<ButtonImportData />
						<ButtonAdd
							text={"Nuevo cliente"}
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
			</TemplateAdministrativo>
			{/* Modal agregar */}
			<Modal
				title={isEdit ? "Editar Cliente" : "Nuevo Cliente"}
				isOpen={isOpenModal}
				closeModal={closeModal}
			>
				{/* Form */}
				<form className="flex flex-col gap-5">
					<Input label="Nombre o Razon Social" />
					<div className="flex gap-5">
						<Select label="Tipo de documento">
              <Option value="dni">DNI</Option>
              <Option value="ruc">RUC</Option>
            </Select>
						<Input label="N° de documento" type="number"/>
					</div>
					<div className="flex gap-5">
						<Input label="Correo" type="email" />
						<Input label="Teléfono" />
					</div>
					<div className="w-full flex justify-end gap-5">
						<ButtonCancel onClick={closeModal} />
						<ButtonSave onClick={saveData} />
					</div>
				</form>
			</Modal>
			{/* Modal Eliminar */}
			<ModalConfirmDelete
				title={"Eliminar Personal"}
				isOpen={isOpenModalDelete}
				closeModal={() => setIsOpenModalDelete(false)}
			/>
		</>
	);
}
