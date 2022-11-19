import Image from "next/image";
import { Image as Logo } from "iconsax-react";
import { useState } from "react";
import {
	ButtonAdd,
	ButtonEdit,
	ButtonDelete,
	ButtonSave,
	ButtonCancel,
} from "../../../app/components/elements/Buttons";
import { Empresas } from "../../../data/empresas";
import { Container } from "../../../app/components/elements/Containers";
import { Title } from "../../../app/components/elements/Title";
import {
	Table,
	TableD,
	TableDOptions,
	TableH,
	TableRH,
} from "../../../app/components/elements/Table";
import {
	ModalConfirmDelete,
	ModalLg,
} from "../../../app/components/modules/Modal";
import { Group, GroupInputs } from "../../../app/components/elements/Form";
import { Input } from "@material-tailwind/react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPEG", "PNG"];

export default function DatosEmpresa() {

	const [isOpenModal, setIsOpenModal] = useState(false);
	const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
	const [isEdit, setIsEdit] = useState(false)

	// Modal Agregar empresa
	const closeModal = () => {
		setIsOpenModal(false);
		setFile(null);
	};

	const openModal = (isEdit) => {
		setIsOpenModal(true);
		setIsEdit(isEdit);
	};

	// Datos de la empresa
	const empresas = Empresas;

	// Logo de la empresa
	const [file, setFile] = useState(null);
	const [logoPreview, setLogoPreview] = useState(null);

	const handleChange = (file) => {
		setFile(file);
		setLogoPreview(URL.createObjectURL(file));
	};

	return (
		<>
			<Container>
				<Title>
					<h1 className="text-2xl font-semibold">Empresas</h1>
					<ButtonAdd
						text={"Nueva empresa"}
						onClick={() => openModal(false)}
					/>
				</Title>
				{/* Table */}
				<Table>
					<thead>
						<TableRH>
							<TableH>#</TableH>
							<TableH>Logo</TableH>
							<TableH>Nombre</TableH>
							<TableH>RUC</TableH>
							<TableH>Dirección</TableH>
							<TableH>Teléfono</TableH>
							<TableH>Correo</TableH>
							<TableH />
						</TableRH>
					</thead>
					<tbody>
						{empresas.map(
							(
								{
									id,
									logo,
									nombre,
									ruc,
									direccion,
									telefono,
									email,
								},
								index
							) => {
								return (
									<tr key={index}>
										<TableD>
											<p>{id}</p>
										</TableD>
										<TableD>
											<div className="flex-shrink-0 w-10 h-10">
												<Image
													className="w-full h-full rounded-full"
													src={
														logo === ""
															? "/images/placeholder.jpg"
															: logo
													}
													alt=""
													width={40}
													height={40}
													objectFit="cover"
												/>
											</div>
										</TableD>
										<TableD>
											<p>{nombre}</p>
										</TableD>
										<TableD>
											<p>{ruc}</p>
										</TableD>
										<TableD>
											<p>{direccion}</p>
										</TableD>
										<TableD>
											<p>{telefono}</p>
										</TableD>
										<TableD>
											<p>{email}</p>
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
			</Container>

			{/* Modal */}
			<ModalLg
				title={isEdit ? "Editar Empresa" : "Nueva Empresa"}
				isOpen={isOpenModal}
				closeModal={closeModal}
			>
				<Group title={"Logo de la empresa"}>
					<FileUploader
						multiple={false}
						handleChange={handleChange}
						name="file"
						types={fileTypes}
						accept={fileTypes}
					>
						<div className="flex justify-center items-center rounded-md border-2 border-dashed border-primary-200 py-10 bg-primary-50">
							<div className="space-y-1 text-center flex flex-col items-center">
								<Logo className="text-primary-200" />
								<div className="flex text-sm text-primary-600">
									<p className="pl-1">
										Arrastre y suelte su imagen aqui, o{" "}
										<span className="cursor-pointer font-semibold">
											Seleccione un archivo
										</span>{" "}
									</p>
								</div>
							</div>
						</div>
					</FileUploader>
					<p>
						{file ? (
							<div className=" w-full flex gap-2 text-xs items-center">
								<Image
									src={logoPreview}
									width={100}
									height={20}
								/>{" "}
								{`Nombre del archivo: ${file.name}`}
							</div>
						) : (
							""
						)}
					</p>
				</Group>
				<Group title={"Datos de la empresa"}>
					<GroupInputs>
						<Input label="RUC" />
						<Input label="Nombre" />
					</GroupInputs>
					<GroupInputs>
						<Input label="Dirección" />
						<Input label="Teléfono" />
					</GroupInputs>
					<GroupInputs>
						<Input label="Correo" />
						<Input label="Página web" />
					</GroupInputs>
				</Group>
				<div className="w-full flex justify-end gap-5">
					<ButtonCancel onClick={closeModal} />
					<ButtonSave onClick={"hola"} />
				</div>
			</ModalLg>
			{/* Modal Eliminar Empresa */}
			<ModalConfirmDelete
				title={"Eliminar Empresa"}
				isOpen={isOpenModalDelete}
				closeModal={() => setIsOpenModalDelete(false)}
			/>
		</>
	);
}
