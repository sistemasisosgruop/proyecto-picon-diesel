import { Input } from "@material-tailwind/react";
import { useMemo } from "react";
import {
	ButtonAdd,
	ButtonCancel,
	ButtonSave,
} from "../../../../app/components/elements/Buttons";
import { GroupInputs } from "../../../../app/components/elements/Form";
import { Title } from "../../../../app/components/elements/Title";
import {
	Modal,
	ModalConfirmDelete,
} from "../../../../app/components/modules/Modal";
import TableComplete from "../../../../app/components/modules/TableComplete";
import TemplatePresupuesto from "../../../../app/components/templates/mantenimiento/TemplatePresupuesto";
import { useModal } from "../../../../app/hooks/useModal";
import { materiales } from "../../../../data/materiales";

export default function Materiales() {
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
			{ Header: "Familia", accessor: "familia" },
			{ Header: "SubFamilia", accessor: "subfamilia" },
			{ Header: "Correlativo", accessor: "correlativo" },
			{ Header: "Nombre", accessor: "nombre" },
			{ Header: "Precio", accessor: "precio" },
		],
		[]
	);

	const data = useMemo(() => materiales, []);

	return (
		<>
			<TemplatePresupuesto>
				<Title text={"Lista Materiales"}>
					<div className="flex gap-4">
						<ButtonAdd
							text={"Nuevo material"}
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
			</TemplatePresupuesto>
			{/* Modal agregar */}
			<Modal
				title={isEdit ? "Editar material" : "Nuevo material"}
				isOpen={isOpenModal}
				closeModal={closeModal}
			>
				{/* Form */}
				<form className="flex flex-col gap-5">
					<GroupInputs>
						<Input label="Familia" />
						<Input label="SubFamilia" />
						<Input label="Correlativo" />
					</GroupInputs>
					<Input label="Nombre" />
					<Input label="Precio" type={"number"} />
					<div className="w-full flex justify-end gap-5">
						<ButtonCancel onClick={closeModal} />
						<ButtonSave onClick={saveData} />
					</div>
				</form>
			</Modal>
			{/* Modal Eliminar */}
			<ModalConfirmDelete
				title={"Eliminar material"}
				isOpen={isOpenModalDelete}
				closeModal={() => setIsOpenModalDelete(false)}
			/>
		</>
	);
}
