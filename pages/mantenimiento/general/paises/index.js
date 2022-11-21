import { Input } from "@material-tailwind/react";
import { ArrowDown, ArrowLeft2, ArrowUp } from "iconsax-react";
import { useMemo } from "react";
import { useSortBy, useTable, usePagination } from "react-table";
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
	TableRH,
} from "../../../../app/components/elements/Table";
import { Title } from "../../../../app/components/elements/Title";
import {
	ModalConfirmDelete,
	Modal,
} from "../../../../app/components/modules/Modal";
import TemplateGeneral from "../../../../app/components/templates/TemplateGeneral";
import { useModal } from "../../../../app/hooks/useModal";
import { paises } from "../../../../data/paises";

export default function Paises() {
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

	// Datos de los paises
	const columns = useMemo(
		() => [
			{ Header: "#", accessor: "id" },
			{ Header: "Codigo", accessor: "codigo" },
			{ Header: "Nombre", accessor: "nombre" },
		],
		[]
	);

	const data = useMemo(() => paises, []);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		page,
		canPreviousPage,
		canNextPage,
		gotoPage,
		pageCount,
		nextPage,
		previousPage,
		state: { pageIndex, pageSize },
	} = useTable(
		{ columns, data, initialState: { pageIndex: 0 } },
		useSortBy,
		usePagination
	);


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
				{/* Table List */}
				<pre>
					<code>
						{JSON.stringify(
							{
								pageIndex,
								pageSize,
								pageCount,
								canNextPage,
								canPreviousPage,
							},
							null,
							2
						)}
					</code>
				</pre>
				<Table {...getTableProps()}>
					<thead>
						{headerGroups.map((headerGroup, index) => (
							<TableRH
								key={index}
								{...headerGroup.getHeaderGroupProps()}
							>
								{headerGroup.headers.map((column, indexCol) => (
									<th
										className="p-5"
										key={indexCol}
										{...column.getHeaderProps(
											column.getSortByToggleProps()
										)}
									>
										<p className="text-left text-xs font-semibold flex gap-4 relative">
											{column.render("Header")}
											<span className="absolute right-0">
												{column.isSorted ? (
													column.isSortedDesc ? (
														<ArrowDown size={12} />
													) : (
														<ArrowUp size={12} />
													)
												) : (
													""
												)}
											</span>
										</p>
									</th>
								))}
							</TableRH>
						))}
					</thead>
					<tbody {...getTableBodyProps()}>
						{page.map((row, index) => {
							prepareRow(row);
							return (
								<tr key={index} {...row.getRowProps()}>
									{row.cells.map((cell, indexCell) => {
										return (
											<TableD
												key={indexCell}
												{...cell.getCellProps()}
											>
												<p>{cell.render("Cell")}</p>
											</TableD>
										);
									})}
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
				<div>
					<span>
						<strong>
							{pageIndex + 1} de {pageCount}
						</strong>{" "}
					</span>
					<button
						className="font-semibold text-sm"
						onClick={() => gotoPage(0)}
						disabled={!canPreviousPage}
					>
						{'<<'}
					</button>
					<button
						onClick={() => previousPage()}
						disabled={!canPreviousPage}
					>
						{" "}
						{"<"}
					</button>
					<button onClick={() => nextPage()} disabled={!canNextPage}>
						{" "}
						{">"}
					</button>
					<button
						onClick={() => gotoPage(pageCount - 1)}
						disabled={!canNextPage}
					>
						{" "}
						{">>"}
					</button>
				</div>
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
