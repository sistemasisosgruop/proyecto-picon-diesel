import { Checkbox, Input } from "@material-tailwind/react";
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
import { vendedores } from "../../../../data/vendedores";

export default function Vendedores() {
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
			{ Header: "Correo", accessor: "correo" },
			{ Header: "Teléfono", accessor: "telefono" },
			{ Header: "Dirección", accessor: "direccion" },
			{ Header: "% Comision", accessor: "comision" },
			{ Header: "Aprobar Cotización", accessor: "aproCotizacion" },
			{ Header: "Estado", accessor: "estado" },

		],
		[]
	);

	const data = useMemo(() => vendedores, []);

	return (
		<>
			<TemplateAdministrativo>
				<Title text={"Lista Vendedores"}>
					<div className="flex gap-4">
						<ButtonImportData />
						<ButtonAdd
							text={"Nuevo vendedor"}
							onClick={() => openModal(false)}
						/>
					</div>
				</Title>
				{/* Table list */}
				<TableComplete columns={columns} data={data} openModal={openModal} setIsOpenModalDelete={setIsOpenModalDelete} />
			</TemplateAdministrativo>
			{/* Modal agregar */}
			<Modal
				title={isEdit ? "Editar Vendedor" : "Nuevo Vendedor"}
				isOpen={isOpenModal}
				closeModal={closeModal}
			>
				{/* Form */}
				<form className="flex flex-col gap-5">
					<Input label="Nombre" />
					<div className="flex gap-5">
						<Input label="Correo" type="email"/>
						<Input label="Contraseña" />
					</div>
					<div className="flex gap-5">
						<Input label="Teléfono" />
						<Input label="Dirección" />
					</div>
					<Input label="% Comision" type="number" />
					<Checkbox label="Aprobación de cotización" />
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
