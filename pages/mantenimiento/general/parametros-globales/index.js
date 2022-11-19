import { Input } from "@material-tailwind/react";
import { Settings } from "iconsax-react";
import {
	ButtonAdd,
	ButtonCancel,
	ButtonDelete,
	ButtonEdit,
	ButtonSave,
} from "../../../../app/components/elements/Buttons";
import { Search } from "../../../../app/components/elements/Search";
import {
	Table,
	TableD,
	TableDOptions,
	TableH,
	TableRH,
} from "../../../../app/components/elements/Table";
import { Title } from "../../../../app/components/elements/Title";
import {
	Modal,
	ModalConfirmDelete,
} from "../../../../app/components/modules/Modal";
import TemplateGeneral from "../../../../app/components/templates/TemplateGeneral";
import { useModal } from "../../../../app/hooks/useModal";
import { parametros } from "../../../../data/parametros";

export default function ParametrosGlobales() {
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

	return (
		<>
			<TemplateGeneral>
				<Title text={"Lista Parámetros Globales"}>
					<ButtonAdd
						text={"Nuevo Parámetro"}
						onClick={() => openModal(false)}
					/>
				</Title>
				<Search />
				{/* Table list parametros glabales */}
				<Table>
					<thead>
						<TableRH>
							<TableH>Parámetro</TableH>
							<TableH>Valor</TableH>
							<TableH />
						</TableRH>
					</thead>
					<tbody>
						{parametros.map(({ nombre, valor }, index) => (
							<tr key={index}>
								<TableD>
									<div className="flex gap-2">
										<Settings />
										<p className="font-semibold">
											{nombre}:
										</p>
									</div>
								</TableD>
								<TableD>{valor}</TableD>
								<TableDOptions>
									<ButtonEdit
										onClick={() => openModal(true)}
									/>
									<ButtonDelete
										onClick={() => setIsOpenModalDelete(true)}
									/>
								</TableDOptions>
							</tr>
						))}
					</tbody>
				</Table>
			</TemplateGeneral>
			{/* Modal */}
			<Modal
				title={isEdit ? "Editar Parámetro" : "Nuevo Parámetro"}
				isOpen={isOpenModal}
				closeModal={closeModal}
			>
				{/* Form */}
				<form className="flex flex-col gap-5">
					<Input label="Nombre" />
					<Input label="Valor" />
					<div className="w-full flex justify-end gap-5">
						<ButtonCancel onClick={closeModal} />
						<ButtonSave onClick={saveData} />
					</div>
				</form>
			</Modal>
			{/* Modal Eliminar */}
			<ModalConfirmDelete
				title={"Eliminar Parámetro"}
				isOpen={isOpenModalDelete}
				closeModal={() => setIsOpenModalDelete(false)}
			/>
		</>
	);
}
