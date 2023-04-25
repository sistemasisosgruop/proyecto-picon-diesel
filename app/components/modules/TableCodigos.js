import { useContext, useMemo } from "react";
import "regenerator-runtime/runtime";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  // useAsyncDebounce,
  useSortBy,
  usePagination,
} from "react-table";

import { matchSorter } from "match-sorter";

import { Table as Tabla, TableD, TableDOptions, TableHOptions, TableRH } from "../elements/Table";
import {
  ArrowDown,
  // ArrowLeft2,
  // ArrowRight2,
  ArrowUp,
  // SearchNormal1,
} from "iconsax-react";
// import { ArrowLeftFast, ArrowRightFast } from "../elements/icons/Arrow";
import { ButtonDelete } from "../elements/Buttons";
import { MaterialesContext } from "../../../contexts/materiales.context";

// function GlobalFilter({
// 	preGlobalFilteredRows,
// 	globalFilter,
// 	setGlobalFilter,
// }) {
// 	const count = preGlobalFilteredRows.length;
// 	const [value, setValue] = useState(globalFilter);
// 	const onChange = useAsyncDebounce((value) => {
// 		setGlobalFilter(value || undefined);
// 	}, 200);

// 	return (
// 		<div className="w-full pt-2 relative mx-auto text-gray-600">
// 			<input
// 				className="w-full bg-primary-50 h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
// 				type="search"
// 				name="search"
// 				value={value || ""}
// 				onChange={(e) => {
// 					setValue(e.target.value);
// 					onChange(e.target.value);
// 				}}
// 				placeholder={`Buscar en los ${count} elementos...`}
// 			/>
// 			<button type="submit" className="absolute right-0 top-0 mt-5 mr-4">
// 				<SearchNormal1 size={15} />
// 			</button>
// 		</div>
// 	);
// }

// Define a default UI for filtering
function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [...rows.map((row) => row.values[id])] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

// Our table component
function Table({ columns, data }) {
  const { codigos, setCodigos } = useContext(MaterialesContext);
  const filterTypes = useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    // state,
    // preGlobalFilteredRows,
    // setGlobalFilter,
    page,
    // canPreviousPage,
    // canNextPage,
    // pageCount,
    // gotoPage,
    // nextPage,
    // previousPage,
    // state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    useSortBy, // useSortBy!
    usePagination // usePagination!
  );

  return (
    <>
      <Tabla {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <TableRH {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, indexCol) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={indexCol}
                  className="p-5"
                >
                  <p className="text-left text-xs font-semibold flex gap-4 justify-between">
                    {column.render("Header")}
                    <span>
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
              <TableHOptions />
            </TableRH>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell, indexCell) => {
                  return (
                    <TableD {...cell.getCellProps()} key={indexCell}>
                      {cell.render("Cell")}
                    </TableD>
                  );
                })}
                <TableDOptions>
                  <ButtonDelete
                    onClick={() => {
                      console.log("delete", row.original.tipoCodigo);
                      const { tipoCodigo, id } = row.original;
                      let filterCodigos;
                      switch (tipoCodigo) {
                        case "reemplazo":
                          filterCodigos = codigos.reemplazo.filter(
                            (material) => material.id !== id
                          );
                          setCodigos({ ...codigos, reemplazo: filterCodigos });

                          break;
                        case "similitud":
                          filterCodigos = codigos.similitud.filter(
                            (material) => material.id !== id
                          );
                          setCodigos({ ...codigos, similitud: filterCodigos });

                          break;
                        case "equivalencia":
                          filterCodigos = codigos.equivalencia.filter(
                            (material) => material.id !== id
                          );
                          setCodigos({ ...codigos, equivalencia: filterCodigos });

                          break;
                        default:
                          filterCodigos = codigos.aplicacionMaquina.filter(
                            (maquina) => maquina.id !== id
                          );
                          setCodigos({ ...codigos, aplicacionMaquina: filterCodigos });

                          break;
                      }
                    }}
                  />
                </TableDOptions>
              </tr>
            );
          })}
        </tbody>
      </Tabla>
      {/* <div className="flex gap-2 justify-end items-center text-xs">
				<span>
					<strong>
						{pageIndex + 1} de {pageCount}
					</strong>{" "}
				</span>
				<button
					className="cursor-pointer text-primary-700 hover:text-primary disabled:text-primary-300"
					onClick={() => gotoPage(0)}
					disabled={!canPreviousPage}
				>
					<ArrowLeftFast />
				</button>
				<button
					className="cursor-pointer text-primary-700 hover:text-primary disabled:text-primary-300"
					onClick={() => previousPage()}
					disabled={!canPreviousPage}
				>
					<ArrowLeft2 />
				</button>
				<button
					className="cursor-pointer text-primary-700 hover:text-primary disabled:text-primary-300"
					onClick={() => nextPage()}
					disabled={!canNextPage}
				>
					<ArrowRight2 />
				</button>
				<button
					className="cursor-pointer text-primary-700 hover:text-primary disabled:text-primary-300"
					onClick={() => gotoPage(pageCount - 1)}
					disabled={!canNextPage}
				>
					<ArrowRightFast />
				</button>
			</div> */}
    </>
  );
}

function filterGreaterThan(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

filterGreaterThan.autoRemove = (val) => typeof val !== "number";

function TableCodigos({ columns, data }) {
  return <Table columns={columns} data={data} />;
}

export default TableCodigos;
