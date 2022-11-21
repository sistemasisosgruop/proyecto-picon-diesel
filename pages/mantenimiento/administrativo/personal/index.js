import { Input } from "@material-tailwind/react";
import {
	ButtonAdd,
	ButtonCancel,
	ButtonDelete,
	ButtonEdit,
	ButtonImportData,
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
import TemplateAdministrativo from "../../../../app/components/templates/TemplateAdministrativo";
import { useModal } from "../../../../app/hooks/useModal";
import { personal } from "../../../../data/personal";

export default function Personal() {
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
			<TemplateAdministrativo>
				<Title text={"Lista Personal"}>
					<div className="flex gap-4">
						<ButtonImportData />
						<ButtonAdd
							text={"Nuevo personal"}
							onClick={() => openModal(false)}
						/>
					</div>
				</Title>
				<Search />
				{/* Table list paises */}
				<Table>
					<thead>
						<TableRH>
							<TableH>#</TableH>
							<TableH>Codigo</TableH>
							<TableH>Nombre</TableH>
							<TableH>Correo</TableH>
							<TableH>Teléfono</TableH>
							<TableH>Cargo</TableH>
							<TableH />
						</TableRH>
					</thead>
					<tbody>
						{personal.map(
							(
								{ id, codigo, nombre, correo, telefono, cargo },
								index
							) => {
								return (
									<tr key={index}>
										<TableD>
											<p>{id}</p>
										</TableD>
										<TableD>
											<p>{codigo}</p>
										</TableD>
										<TableD>
											<p>{nombre}</p>
										</TableD>
										<TableD>
											<p>{correo}</p>
										</TableD>
										<TableD>
											<p>{telefono}</p>
										</TableD>
										<TableD>
											<p>{cargo}</p>
										</TableD>
										<TableDOptions>
											<ButtonEdit
												onClick={() => openModal(true)}
											/>
											<ButtonDelete
												onClick={() =>
													setIsOpenModalDelete(true)
												}
											/>
										</TableDOptions>
									</tr>
								);
							}
						)}
					</tbody>
				</Table>
			</TemplateAdministrativo>
			{/* Modal agregar */}
			<Modal
				title={isEdit ? "Editar Personal" : "Nuevo Personal"}
				isOpen={isOpenModal}
				closeModal={closeModal}
			>
				{/* Form */}
				<form className="flex flex-col gap-5">
					<Input label="Nombre" />
					<div className="flex gap-5">
						<Input label="Correo" />
						<Input label="Contraseña" />
					</div>
					<div className="flex gap-5">
						<Input label="Teléfono" />
						<Input label="Dirección" />
					</div>
					<Input label="Puesto" />
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