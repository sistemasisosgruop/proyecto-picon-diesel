// @ts-ignore
import { Listbox, Transition } from "@headlessui/react";
import {
  Popover,
  PopoverContent,
  PopoverHandler,
} from "@material-tailwind/react";
import { Building, Building4, Buildings2 } from "iconsax-react";
import { Fragment, useEffect, useState } from "react";
import { Check } from "./icons/Check";
import { Empresas } from "./icons/Empresas";
import { axiosRequest } from "../../utils/axios-request";
import { useAuthState } from "../../../contexts/auth.context";

export const SelectEmpresas = () => {
  const [empresas, setEmpresas] = useState([{ name: "Default" }]);
  const [selectedEmpresa, setSelectedEmpresa] = useState({
    name: "default",
    id: 0,
  });
  const [sucursales, setSucursales] = useState([{ name: "Default" }]);
  const [selectedSucursal, setSelectedSucursal] = useState({ name: "default" });
  const auth = useAuthState();

  useEffect(() => {
    if (selectedEmpresa.id !== 0) {
      getSucursales(selectedEmpresa.id);
      localStorage.setItem("empresa", JSON.stringify(selectedEmpresa));
    }
  }, [selectedEmpresa]);

  useEffect(() => {
    getEmpresas();
  }, []);

  const getEmpresas = async () => {
    const { data: { data } } = await axiosRequest(
      "get",
      `/api/mantenimiento/empresas?adminId=${auth.id}`
    );
    localStorage.setItem("empresas", JSON.stringify(data));
    const result = data.map(({ nombre, id }) => ({ name: nombre, id }));
    setEmpresas(result);
    setSelectedEmpresa(result[0]);
    getSucursales(result[0].id);
  };

  const getSucursales = async (empresaId) => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/sucursales?empresaId=${empresaId}`
    );

    const result = data.data.map(({ nombre, id }) => ({ name: nombre, id }));
    setSucursales(result);
    setSelectedSucursal(result[0]);
  };

  return (
    <Popover placement="right-end">
      <PopoverHandler>
        <button
          type="button"
          className="flex gap-3 p-2 h-[40px] w-[40px] hover:bg-secundary rounded-[10px] hover:text-primary z-50 justify-center items-center"
        >
          <Building4 />
        </button>
      </PopoverHandler>
      <PopoverContent className="z-50 flex flex-col gap-4">
        <div className="flex gap-3 justify-center items-center">
          <div className="p-4 bg-secundary-200 text-secundary rounded">
            <Buildings2 />
          </div>
          <Listbox value={selectedEmpresa} onChange={setSelectedEmpresa}>
            <div className="relative mt-1 w-[200px]">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate">{selectedEmpresa.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <Empresas
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-[999]">
                  {empresas.map((empresa, empresaIdx) => (
                    <Listbox.Option
                      key={empresaIdx}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? "bg-secundary-100 text-secundary-800"
                            : "text-gray-900"
                        }`
                      }
                      value={empresa}
                    >
                      {({ active, selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              active ? "font-medium" : "font-normal"
                            }`}
                          >
                            {empresa.name}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-secundary-600">
                              <Check className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
        <div className="flex gap-3 justify-center items-center">
          <div className="p-4 bg-secundary-200 text-secundary rounded">
            <Building />
          </div>
          <Listbox value={selectedSucursal} onChange={setSelectedSucursal}>
            <div className="relative mt-1 w-[200px]">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate">{selectedSucursal.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <Empresas
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {sucursales.map((sucursal, sucursalIdx) => (
                    <Listbox.Option
                      key={sucursalIdx}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? "bg-secundary-100 text-secundary-800"
                            : "text-gray-900"
                        }`
                      }
                      value={sucursal}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {sucursal.name}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-secundary-600">
                              <Check className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </PopoverContent>
    </Popover>
  );
};
