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
import TemplateInventario from "../../../../app/components/templates/mantenimiento/TemplateInventario";
import { useModal } from "../../../../app/hooks/useModal";
import { vehiculos } from "../../../../data/vehiculos";

export default function Vehiculos() {
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
			{ Header: "Placa", accessor: "placa" },
			{ Header: "Marca", accessor: "marca" },
			{ Header: "Modelo", accessor: "modelo" },
			{ Header: "Color", accessor: "color" },
			{ Header: "Tarjeta de propiedad", accessor: "tarjetaPropiedad" },
			{ Header: "Descripción", accessor: "descripcion" },
		],
		[]
	);

	const data = useMemo(() => vehiculos, []);

	return (
		<>
			<TemplateInventario>
				<Title text={"Lista Vehículos"}>
					<div className="flex gap-4">
						<ButtonImportData />
						<ButtonAdd
							text={"Nuevo vehículo"}
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
				title={isEdit ? "Editar Vehículo" : "Nuevo Vehículo"}
				isOpen={isOpenModal}
				closeModal={closeModal}
			>
				{/* Form */}
				<form className="flex flex-col gap-5">
					<div className="flex gap-5">
						<Input label="Placa" />
						<Input label="Marca" />
					</div>
					<div className="flex gap-5">
						<Input label="Modelo" />
						<Input label="Tipo" />
					</div>
					<div className="flex gap-5">
						<Input label="Color" />
						<Input label="Tarjeta de propiedad" />
					</div>
					<Input label="Descripción" />
					<div className="w-full flex justify-end gap-5">
						<ButtonCancel onClick={closeModal} />
						<ButtonSave onClick={saveData} />
					</div>
				</form>
			</Modal>
			{/* Modal Eliminar */}
			<ModalConfirmDelete
				title={"Eliminar Vehículo"}
				isOpen={isOpenModalDelete}
				closeModal={() => setIsOpenModalDelete(false)}
			/>
		</>
	);
}
