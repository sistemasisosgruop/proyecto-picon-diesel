import { SearchNormal1 } from "iconsax-react";
import Image from "next/image";
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
import { ModalLg } from "../../../app/components/modules/Modal";
import { Group, GroupInputs } from "../../../app/components/elements/Form";
import { Input } from "@material-tailwind/react";

export default function DatosEmpresa() {
	const [isOpenModal, setIsOpenModal] = useState(false);

	const closeModal = () => {
		setIsOpenModal(false);
	};

	const openModal = () => {
		setIsOpenModal(true);
	};

	const empresas = Empresas;

	return (
		<>
			<Container>
				<Title>
					<h1 className="text-2xl font-semibold">Empresas</h1>
					<ButtonAdd text={"Nueva empresa"} onClick={openModal} />
				</Title>
				{/* Search */}
				<div className="w-full pt-2 relative mx-auto text-gray-600">
					<input
						className="w-full bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
						type="search"
						name="search"
						placeholder="Search"
					/>
					<button
						type="submit"
						className="absolute right-0 top-0 mt-5 mr-4"
					>
						<SearchNormal1 size={15} />
					</button>
				</div>
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
													src={logo}
													alt=""
													width={40}
													height={40}
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
											<ButtonEdit onClick={"hola"} />
											<ButtonDelete onClick={"hola"} />
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
				title={"Nueva Empresa"}
				isOpen={isOpenModal}
				closeModal={closeModal}
			>
				<Group title={"Logo de la empresa"}></Group>
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
					<ButtonSave onClick={closeModal} />
				</div>
			</ModalLg>
		</>
	);
}
