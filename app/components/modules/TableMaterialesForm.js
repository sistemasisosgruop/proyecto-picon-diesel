"use client";
import { useMemo, useState,useContext } from "react";
import "regenerator-runtime/runtime";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  usePagination,
} from "react-table";
import { matchSorter } from "match-sorter";
import { Table as Tabla, TableD, TableDOptions, TableHOptions, TableRH } from "../elements/Table";
import { ArrowDown, ArrowLeft2, ArrowRight2, ArrowUp, SearchNormal1 } from "iconsax-react";
import { ArrowLeftFast, ArrowRightFast } from "../elements/icons/Arrow";
import { ButtonDelete, ButtonEdit } from "../elements/Buttons";
import { Divider } from "../elements/Divider";
import { Dropdown, DropdownItem } from "../elements/Dropdown";
import { axiosRequest } from "../../utils/axios-request";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { MaterialesContext } from "../../../contexts/materiales.context";

function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter, isSearching = true }) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);  
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  const [empresaId] = useLocalStorage("empresaId");
  const { selectedMateriales, setSelectedMateriales } = useContext(MaterialesContext);
  const [dropdownMateriales, setDropdownMateriales] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // get materials by maquinaId filter
  const handleSearchMaterials = async ({ target }) => {
    // if(target.value.length === 0)return;
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/maestro-de-codigos/configuracion/materiales?empresaId=${empresaId}&filter=${target.value}`
    );

    setDropdownMateriales(data?.data);
  };

  // const handleClickMaterial = (selMaterial) => {
    
  // }
  return ( isSearching ?
    (<div className="w-full pt-2 relative mx-auto text-gray-600">
      <input
        className="w-full bg-primary-50 h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
        type="search"
        name="search"
        // value={value || ""}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => {
          setValue(e.target.value);
          // onChange(e.target.value);
          handleSearchMaterials(e);
        }}
        placeholder={`Buscar en los ${count} elementos...`}
      />
      <button type="submit" className="absolute right-0 top-0 mt-5 mr-4">
        <SearchNormal1 size={15} />
      </button>
      <Dropdown isOpen={isOpen} elements={dropdownMateriales?.length}>
        {dropdownMateriales?.map((selMaterial) => {
          return (
            <DropdownItem
              handleClick={() => {
                const currentMateriales = selectedMateriales.materiales;
                const findMaterialCodigo = currentMateriales.some(
                  (material) => material.id === selMaterial.id
                );
                // console.log(findMaterialCodigo);
                if(!findMaterialCodigo) {
                  // selMaterial.cantidad = 0;
                  currentMateriales.push({...selMaterial, cantidad: 0});
                }
                // console.log(currentMateriales);
                setSelectedMateriales({...selectedMateriales, materiales: currentMateriales});
                setIsOpen(false);
              }}
              key={selMaterial.id}
              name={`COD: ${selMaterial.codigo} - Denominacion: ${selMaterial.denominacion} - COD Fabricante: ${selMaterial.codigoFabricante} - Precio: ${selMaterial.ventaUnidad} - Stock: ${selMaterial.stock}`}
            />
          )
        })}
      </Dropdown>
    </div>)
    : <></>
  );
}

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
function Table({ columns, data, isSearching = true, canDelete = true}) {

  const { selectedMateriales, setSelectedMateriales } = useContext(MaterialesContext);

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
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    page,

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
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
        isSearching={isSearching}
      />
      <Divider />
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
                  {/* <ButtonEdit onClick={undefined} /> */}
                  {canDelete && <ButtonDelete onClick={()=>{
                    // console.log(row.original);
                    const {id: idMaterial} = row.original;
                    const newMateriales = selectedMateriales.materiales.filter((material) => material.id !== idMaterial);
                    setSelectedMateriales({...selectedMateriales, materiales: newMateriales});
                  }} />}
                  
                </TableDOptions>
              </tr>
            );
          })}
        </tbody>
      </Tabla>
      <Divider />
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

function TableMaterialesForm({ columns, data, isSearching = true, canDelete = true }) {
  return <Table columns={columns} data={data} isSearching={isSearching} canDelete={canDelete}/>;
}

export default TableMaterialesForm;
