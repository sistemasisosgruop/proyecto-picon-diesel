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
import TemplateInventario from "../../../../app/components/templates/TemplateInventario";
import { useModal } from "../../../../app/hooks/useModal";
import { agenciaDeTransporte } from "../../../../data/agencia-de-transporte";

export default function AgenciaTransporte() {
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
			{ Header: "Nombre / Razon Social", accessor: "nombre" },
			{ Header: "Tipo de documento", accessor: "tipoDocumento" },
			{ Header: "N° de documento", accessor: "numeroDocumento" },
			{ Header: "Teléfono", accessor: "telefono" },
			{ Header: "Correo", accessor: "correo" },
			{ Header: "Dirección", accessor: "direccion" },
		],
		[]
	);

	const data = useMemo(() => agenciaDeTransporte, []);

	return (
		<>
			<TemplateInventario>
				<Title text={"Lista Agencias de transporte"}>
					<div className="flex gap-4">
						<ButtonImportData />
						<ButtonAdd
							text={"Nueva agencia"}
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
				title={
					isEdit
						? "Editar Agencia de transporte"
						: "Nueva Agencia de transporte"
				}
				isOpen={isOpenModal}
				closeModal={closeModal}
			>
				{/* Form */}
				<form className="flex flex-col gap-5">
					<Input label="Nombre / Razon Social" />
          <div className="flex gap-5">
            <Select label="Tipo de documento">
              <Option value="DNI">DNI</Option>
              <Option value="RUC">RUC</Option>
            </Select>
            <Input label="N° de documento" />
          </div>
          <div className="flex gap-5">
            <Input label="Teléfono" />
            <Input label="Correo" type="email"/>
          </div>
          <Input label="Dirección" />
					<div className="w-full flex justify-end gap-5">
						<ButtonCancel onClick={closeModal} />
						<ButtonSave onClick={saveData} />
					</div>
				</form>
			</Modal>
			{/* Modal Eliminar */}
			<ModalConfirmDelete
				title={"Eliminar Agencia de transporte"}
				isOpen={isOpenModalDelete}
				closeModal={() => setIsOpenModalDelete(false)}
			/>
		</>
	);
}
