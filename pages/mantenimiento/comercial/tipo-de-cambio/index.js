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
import TemplateComercial from "../../../../app/components/templates/mantenimiento/TemplateComercial";
import { useModal } from "../../../../app/hooks/useModal";
import { tipoDeCambios } from "../../../../data/tipo-de-cambios";

export default function TipoDeCambio() {
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
      { Header: "De", accessor: "de" },
      { Header: "A", accessor: "a" },
      { Header: "Valor", accessor: "valor" },
      { Header: "Fecha", accessor: "fecha" },
		],
		[]
	);

	const data = useMemo(() => tipoDeCambios, []);

	return (
		<>
			<TemplateComercial>
				<Title text={"Lista Tipo de Cambio"}>
					<div className="flex gap-4">
						<ButtonImportData />
						<ButtonAdd
							text={"Nuevo tipo de cambio"}
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
						? "Editar Tipo de cambio"
						: "Nuevo Tipo de cambio"
				}
				isOpen={isOpenModal}
				closeModal={closeModal}
			>
				{/* Form */}
				<form className="flex flex-col gap-5">
					<div className="flex gap-5">
						<Input label="De" />
						<Input label="A" />
					</div>
					<div className="flex gap-5">
						<Input label="Valor" type="number"/>
						<Input label="Fecha" type="date"/>
					</div>
					<div className="w-full flex justify-end gap-5">
						<ButtonCancel onClick={closeModal} />
						<ButtonSave onClick={saveData} />
					</div>
				</form>
			</Modal>
			{/* Modal Eliminar */}
			<ModalConfirmDelete
				title={"Eliminar Tipo de cambio"}
				isOpen={isOpenModalDelete}
				closeModal={() => setIsOpenModalDelete(false)}
			/>
		</>
	);
}
