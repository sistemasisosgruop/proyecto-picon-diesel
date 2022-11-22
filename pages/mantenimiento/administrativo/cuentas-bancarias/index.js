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
import TemplateAdministrativo from "../../../../app/components/templates/mantenimiento/TemplateAdministrativo";
import { useModal } from "../../../../app/hooks/useModal";
import { cuentasBancarias } from "../../../../data/cuentas-bancarias";

export default function CuentasBancarias() {
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
			{ Header: "N° de cuenta", accessor: "numero" },
			{ Header: "Tipo de cuenta", accessor: "tipo" },
			{ Header: "Banco", accessor: "banco" },
			{ Header: "Moneda", accessor: "moneda" },
			{ Header: "Estado", accessor: "estado" },
		],
		[]
	);

	const data = useMemo(() => cuentasBancarias, []);

	return (
		<>
			<TemplateAdministrativo>
				<Title text={"Lista Cuentas Bancarias"}>
					<div className="flex gap-4">
						<ButtonImportData />
						<ButtonAdd
							text={"Nueva cuenta"}
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
				title={
					isEdit ? "Editar Cuenta Bancaria" : "Nueva Cuenta Bancaria"
				}
				isOpen={isOpenModal}
				closeModal={closeModal}
			>
				{/* Form */}
				<form className="flex flex-col gap-5">
					<Input label="N° de cuenta" />
					<Input label="Tipo" />
					<div className="flex gap-5">
						<Input label="Banco" />
						<Input label="Moneda" />
					</div>
					<div className="w-full flex justify-end gap-5">
						<ButtonCancel onClick={closeModal} />
						<ButtonSave onClick={saveData} />
					</div>
				</form>
			</Modal>
			{/* Modal Eliminar */}
			<ModalConfirmDelete
				title={"Eliminar Cuenta Bancaria"}
				isOpen={isOpenModalDelete}
				closeModal={() => setIsOpenModalDelete(false)}
			/>
		</>
	);
}
