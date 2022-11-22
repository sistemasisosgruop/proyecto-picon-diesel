import { Input } from "@material-tailwind/react";
import { useMemo, useState } from "react";
import {
	ButtonAdd,
	ButtonCancel,
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
import { contado } from "../../../../data/contado";
import { credito } from "../../../../data/credito";

export default function FormasDePago() {
	const {
    setIsOpenModalDelete,
		isOpenModalDelete,
	} = useModal();

	const columnsContado = useMemo(
		() => [
			{ Header: "#", accessor: "id" },
			{ Header: "Codigo", accessor: "codigo" },
			{ Header: "Nombre", accessor: "nombre" },
		],
		[]
	);
	const columnsCredito = useMemo(
		() => [
			{ Header: "#", accessor: "id" },
			{ Header: "Codigo", accessor: "codigo" },
			{ Header: "Nombre", accessor: "nombre" },
			{ Header: "N° de días", accessor: "dias" },
		],
		[]
	);

	const dataContado = useMemo(() => contado, []);
	const dataCredito = useMemo(() => credito, []);

  const [isModalContado, setIsModalContado] = useState(false);
  const [isModalCredito, setIsModalCredito] = useState(false)

  const [isEditContado, setIsEditContado] = useState(false)
  const [isEditCredito, setIsEditCredito] = useState(false)

  const openModalContado = (isEdit) => {
    setIsModalContado(true)
    setIsEditContado(isEdit)
  }
  const openModalCredito = (isEdit) => {
    setIsModalCredito(true);
    setIsEditCredito(isEdit)
  }
	const saveData = () => {
		setIsModalContado(false);
		setIsModalCredito(false);
	};

	return (
		<>
			<TemplateComercial>
				<Title text={"Formas de pago"} />
				<div className="flex gap-5">
					<div className="w-1/2 rounded shadow-md p-5">
						<Title text={"Contado"}>
							<ButtonAdd
								text={"Nueva forma de pago"}
								onClick={() => {
									openModalContado(false);
								}}
							/>
						</Title>
						{/* Table list */}
						<TableComplete
							columns={columnsContado}
							data={dataContado}
							openModal={openModalContado}
							setIsOpenModalDelete={setIsOpenModalDelete}
						/>
					</div>
					<div className="w-1/2 rounded shadow-md p-5">
						<Title text={"Crédito"}>
							<ButtonAdd
								text={"Nueva forma de pago"}
								onClick={() => {
									openModalCredito(false);
								}}
							/>
						</Title>
						{/* Table list */}
						<TableComplete
							columns={columnsCredito}
							data={dataCredito}
							openModal={openModalCredito}
							setIsOpenModalDelete={setIsOpenModalDelete}
						/>
					</div>
				</div>
			</TemplateComercial>
			{/* Modal agregar */}
			<Modal
				title={
					isEditContado
						? "Editar Forma de pago Contado"
						: "Nueva forma de pago Contado"
				}
				isOpen={isModalContado}
				closeModal={() => setIsModalContado(false)}
			>
				{/* Form */}
				<form className="flex flex-col gap-5">
					<Input label="Nombre" />
					<div className="w-full flex justify-end gap-5">
						<ButtonCancel
							onClick={() => setIsModalContado(false)}
						/>
						<ButtonSave onClick={saveData} />
					</div>
				</form>
			</Modal>

			<Modal
				title={
					isEditCredito
						? "Editar Forma de pago Credito"
						: "Nueva forma de pago Credito"
				}
				isOpen={isModalCredito}
				closeModal={() => setIsModalCredito(false)}
			>
				{/* Form */}
				<form className="flex flex-col gap-5">
					<Input label="Nombre" />
					<Input label="N° de días" type="number" />
					<div className="w-full flex justify-end gap-5">
						<ButtonCancel
							onClick={() => setIsModalCredito(false)}
						/>
						<ButtonSave onClick={saveData} />
					</div>
				</form>
			</Modal>
			{/* Modal Eliminar */}
			<ModalConfirmDelete
				title={"Eliminar Forma de pago"}
				isOpen={isOpenModalDelete}
				closeModal={() => setIsOpenModalDelete(false)}
			/>
		</>
	);
}
