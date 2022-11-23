import { Input, Option, Select } from "@material-tailwind/react";
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
import TableComplete from "../../../../app/components/modules/TableComplete";
import TemplateMaestroCodigos from "../../../../app/components/templates/mantenimiento/TemplateMaestroCodigos";
import { useModal } from "../../../../app/hooks/useModal";
import { maquinas } from "../../../../data/maquinas";

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
			{ Header: "Codigo", accessor: "codigo" },
			{ Header: "Fábrica Máquina", accessor: "fábricaMaquina" },
			{ Header: "Modelo Máquina", accessor: "modeloMaquina" },
			{ Header: "Nombre Máquina", accessor: "nombreMaquina" },
			{ Header: "Procedencia Máquina", accessor: "procedenciaMaquina" },
			{
				Header: "Código Original del Motor",
				accessor: "codigoOriginalMotor",
			},
			{ Header: "Modelo del Motor", accessor: "modeloMotor" },
			{ Header: "Marca del Motor", accessor: "marcaMotor" },
			{ Header: "Procedencia del Motor", accessor: "procedenciaMotor" },
			{ Header: "N° de cilindros", accessor: "numeroCilindros" },
			{
				Header: "Código fábrica Bomba de Inyeccion",
				accessor: "codigofábricaBombaInyeccion",
			},
			{ Header: "Tipo de Bomba de Inyeccion", accessor: "tipoBombaInyeccion" },
			{
				Header: "Marca fábrica de Sistema deInyeccion",
				accessor: "marcafábricaSistemaInyeccion",
			},
			{
				Header: "Descripción de Bomba de Inyeccion",
				accessor: "descripcionBombasInyeccion",
			},
			{
				Header: "Procedencia Bomba de Inyeccion",
				accessor: "procedenciaBombaInyeccion",
			},
			{
				Header: "Código Original de Bomba de Inyección",
				accessor: "codigoOriginalBombaInyeccion",
			},
			{
				Header: "Código fábrica de Inyector",
				accessor: "codigofábricaInyector",
			},
			{ Header: "Tipo fábrica de Inyector", accessor: "tipofábricaInyector" },
			{
				Header: "Marca fábrica de Inyector",
				accessor: "marcafábricaInyector",
			},
			{ Header: "Descripción Inyector", accessor: "descripcionInyector" },
			{
				Header: "Código Original de Inyector",
				accessor: "codigoOriginalInyector",
			},
			{ Header: "Código Tobera", accessor: "codigoTobera" },
			{ Header: "Tipo Tobera", accessor: "tipoTobera" },
		],
		[]
	);

	const data = useMemo(() => maquinas, []);

	return (
		<>
			<TemplateMaestroCodigos>
				<Title text={"Lista Máquinas"}>
					<div className="flex gap-4">
						<ButtonImportData />
						<ButtonAdd
							text={"Nueva máquina"}
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
			</TemplateMaestroCodigos>
			{/* Modal agregar */}
			<ModalLg
				title={isEdit ? "Editar Máquina" : "Nueva Máquina"}
				isOpen={isOpenModal}
				closeModal={closeModal}
			>
				{/* Form */}
				<form className="flex flex-col gap-5">
				{/* Datos de la maquina */}
					<Group title={"Datos de la Máquina"}>
						<GroupInputs>
							<Select label={"Fábrica Máquina"}>
								<Option value={1}>Fábrica 1</Option>
							</Select>
							<Select label={"Modelo de la Máquina"}>
								<Option value={1}>Fábrica 1</Option>
							</Select>
						</GroupInputs>
						<GroupInputs>
							<Select label={"Nombre de Máquina"}>
								<Option value={1}>Fábrica 1</Option>
							</Select>
							<Select label={"Procedencia"}>
								<Option value={1}>Fábrica 1</Option>
							</Select>
						</GroupInputs>
					</Group>
					{/* Datos del motor */}
					<Group title={"Datos del Motor"}>
						<GroupInputs>
							<Input label={"Código Original del Motor"} />
							<Input label={"Modelo del Motor"} />
						</GroupInputs>
						<GroupInputs>
							<Select label={"Marca del Motor"}>
								<Option value={1}>Fábrica 1</Option>
							</Select>
							<Select label={"Procedencia"}>
								<Option value={1}>Fábrica 1</Option>
							</Select>
							<Input label={"N° de cilindros"} />
						</GroupInputs>
					</Group>
					{/* Datos de la Bomba de inyeccion */}
					<Group title={"Datos de la bomba de Inyección"}>
						<GroupInputs>
							<Input label={"Código fábrica"} />
							<Input label={"Tipo de bomba de inyeccion"} />
						</GroupInputs>
            <GroupInputs>
							<Select
								label={"Marca fábrica de Sistema de Inyección"}
							>
								<Option value={1}>Fábrica 1</Option>
							</Select>
							<Select label={"Descripción de Bomba de Inyección"}>
								<Option value={1}>Fábrica 1</Option>
							</Select>
            </GroupInputs>
						<GroupInputs>
							<Select label={"Procedencia"}>
								<Option value={1}>Fábrica 1</Option>
							</Select>
							<Input
								label={"Código original de Bomba de Inyección"}
							/>
						</GroupInputs>
					</Group>
					{/* Datos del inyector */}
					<Group title={"Datos del Inyector"}>
						<GroupInputs>
							<Input label={"Código fábrica"} />
							<Input label={"Tipo fábrica Inyector"} />
						</GroupInputs>
						<GroupInputs>
							<Select label={"Marca fábrica del Inyector"}>
								<Option value={1}>Fábrica 1</Option>
							</Select>
							<Select label={"Descripción del Inyector"}>
								<Option value={1}>Fábrica 1</Option>
							</Select>
						</GroupInputs>
            <GroupInputs>
							<Select label={"Procedencia"}>
								<Option value={1}>Fábrica 1</Option>
							</Select>
							<Input
								label={"Código original del Inyector"}
							/>
            </GroupInputs>
						<GroupInputs>
							<Input
								label={"Código Tobera"}
							/>
							<Input
								label={"Tipo Tobera"}
							/>
						</GroupInputs>
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
