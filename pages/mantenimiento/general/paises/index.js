import { Input } from "@material-tailwind/react";
import { ButtonAdd, ButtonCancel, ButtonDelete, ButtonEdit, ButtonSave } from "../../../../app/components/elements/Buttons";
import { Search } from "../../../../app/components/elements/Search";
import { Table, TableD, TableDOptions, TableH, TableRH } from "../../../../app/components/elements/Table";
import { Title } from "../../../../app/components/elements/Title";
import { ModalConfirmDelete, Modal } from "../../../../app/components/modules/Modal";
import TemplateGeneral from "../../../../app/components/templates/TemplateGeneral";
import { useModal } from "../../../../app/hooks/useModal";
import { paises } from "../../../../data/paises";

export default function Paises() {

  const { isOpenModal,
    isOpenModalDelete,
    isEdit,
    setIsOpenModalDelete,
    closeModal,
    openModal } = useModal();

  const saveData = () =>{
    closeModal();
  }

	return (
		<>
			<TemplateGeneral>
				<Title text={"Lista Países"}>
					<ButtonAdd
						text={"Nuevo País"}
						onClick={() => openModal(false)}
					/>
				</Title>
				<Search />
				{/* Table list paises */}
				<Table>
					<thead>
						<TableRH>
							<TableH>#</TableH>
							<TableH>Codigo</TableH>
							<TableH>Nombre</TableH>
							<TableH />
						</TableRH>
					</thead>
					<tbody>
						{paises.map(({ id, nombre, codigo }, index) => {
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
						})}
					</tbody>
				</Table>
			</TemplateGeneral>
			{/* Modal agregar */}
			<Modal
				title={isEdit ? "Editar Pais" : "Nuevo Pais"}
				isOpen={isOpenModal}
				closeModal={closeModal}
			>
				{/* Form */}
				<form className="flex flex-col gap-5">
					<Input label="Codigo" />
					<Input label="Nombre" />
					<div className="w-full flex justify-end gap-5">
						<ButtonCancel onClick={closeModal} />
						<ButtonSave onClick={saveData} />
					</div>
				</form>
			</Modal>
			{/* Modal Eliminar */}
			<ModalConfirmDelete
				title={"Eliminar País"}
				isOpen={isOpenModalDelete}
				closeModal={() => setIsOpenModalDelete(false)}
			/>
		</>
	);
}
