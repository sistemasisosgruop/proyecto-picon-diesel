import { Checkbox, Input, Option, Select } from "@material-tailwind/react";
import { useMemo } from "react";
import {
	ButtonAdd,
	ButtonCancel,
	ButtonImportData,
	ButtonSave,
} from "../../../../app/components/elements/Buttons";
import { Group, GroupInputs } from "../../../../app/components/elements/Form";
import { Title } from "../../../../app/components/elements/Title";
import {
	ModalConfirmDelete,
	ModalLg,
} from "../../../../app/components/modules/Modal";
import TableCodigos from "../../../../app/components/modules/TableCodigos";
import TableMateriales from "../../../../app/components/modules/TableMateriales";
import TemplateMaestroCodigos from "../../../../app/components/templates/mantenimiento/TemplateMaestroCodigos";
import { useModal } from "../../../../app/hooks/useModal";
import { caracteristicas } from "../../../../data/caracteristicas";
import { materialesData } from "../../../../data/materiales-data";

export default function Maquinas() {
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
			{ Header: "Código", accessor: "codigo" },
			{ Header: "Familia", accessor: "familia" },
			{ Header: "SubFamilia", accessor: "subfamilia" },
			{ Header: "Correlativo", accessor: "correlativo" },
			{ Header: "Denominación", accessor: "denominacion" },
			{ Header: "Código de Fabricante", accessor: "codigoFabricante" },
			{ Header: "Tipo de Fabricante", accessor: "tipoFabricante" },
			{
				Header: "Código de Motor Original",
				accessor: "codigoMotorOriginal",
			},
			{
				Header: "Código de Bomba de Inyección",
				accessor: "codigoBombaInyeccion",
			},
		],
		[]
	);

	const data = useMemo(() => materialesData, []);

	return (
		<>
			<TemplateMaestroCodigos>
				<Title text={"Lista Materiales"}>
					<div className="flex gap-4">
						<ButtonImportData />
						<ButtonAdd
							text={"Nuevo material"}
							onClick={() => openModal(false)}
						/>
					</div>
				</Title>
				{/* Table list */}
				<TableMateriales
					columns={columns}
					data={data}
					openModal={openModal}
					setIsOpenModalDelete={setIsOpenModalDelete}
				/>
			</TemplateMaestroCodigos>
			{/* Modal agregar */}
			<ModalLg
				title={isEdit ? "Editar Material" : "Nueva Material"}
				isOpen={isOpenModal}
				closeModal={closeModal}
			>
				{/* Form */}
				<form className="flex flex-col gap-5">
					{/* Datos de la maquina */}
					<Group title={"Datos del Material"}>
						<GroupInputs>
							<Select label={"Familia"}>
								<Option value={1}>Fábrica 1</Option>
							</Select>
							<Select label={"SubFamilia"}>
								<Option value={1}>Fábrica 1</Option>
							</Select>
							<Input label={"Correlativo"} />
						</GroupInputs>
						<Input label={"Denominación"} />
						<GroupInputs>
							<Input label={"Código fabricante"} />
							<Input label={"Tipo fabricante"} />
						</GroupInputs>
					</Group>
					{/* Codigos de reemplazo */}
					<Group title={"Codigos de reemplazo"}>
						<Select label={"SubFamilia"}>
							<Option value={1}>Fábrica 1</Option>
						</Select>
						<TableCodigos columns={columns} data={data} />
					</Group>
					{/* Codigos similitud */}
					<Group title={"Codigos de similitud"}>
						<Select label={"SubFamilia"}>
							<Option value={1}>Fábrica 1</Option>
						</Select>
						<TableCodigos columns={columns} data={data} />
					</Group>
					{/* Codigos equivalencia */}
					<Group title={"Codigos de equivalencia"}>
						<Select label={"SubFamilia"}>
							<Option value={1}>Fábrica 1</Option>
						</Select>
						<TableCodigos columns={columns} data={data} />
					</Group>
					{/* Caracteristicas */}
					<Group title={"Seleccionar caracteristicas"}>
						{caracteristicas.map((caracteristica) => (
							<div
								key={caracteristica.id}
								className="flex flex-row gap-5 items-center justify-between"
							>
								<Checkbox
									id={caracteristica.id}
									label={caracteristica.descripcion}
								/>
								<div className="w-72">
									<Input label={"Valor"} />
								</div>
							</div>
						))}
					</Group>
					{/* Aplicación de la maquina */}
					<Group title={"Aplicación de la máquina"}>
						<Select label={"Máquinas"}>
							<Option value={1}>Fábrica 1</Option>
						</Select>
						<TableCodigos columns={columns} data={data} />
					</Group>
					<div className="w-full flex justify-end gap-5">
						<ButtonCancel onClick={closeModal} />
						<ButtonSave onClick={saveData} />
					</div>
				</form>
			</ModalLg>
			{/* Modal Eliminar */}
			<ModalConfirmDelete
				title={"Eliminar Máquina"}
				isOpen={isOpenModalDelete}
				closeModal={() => setIsOpenModalDelete(false)}
			/>
		</>
	);
}
