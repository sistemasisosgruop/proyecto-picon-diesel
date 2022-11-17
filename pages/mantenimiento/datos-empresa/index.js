import { Dialog, Transition } from "@headlessui/react";
import { SearchNormal1 } from "iconsax-react";
import Image from "next/image";
import { Fragment, useState } from "react";
import {
  ButtonAdd,
  ButtonEdit,
  ButtonDelete,
} from "../../../app/components/elements/Buttons";
import { Empresas } from "../../../data/empresas";
import { Container } from "../../../app/components/elements/Containers";
import { Title } from "../../../app/components/elements/Title";

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
          <button type="submit" className="absolute right-0 top-0 mt-5 mr-4">
            <SearchNormal1 size={15} />
          </button>
        </div>
        {/* Table */}
        <div className="overflow-x-auto w-full rounded-xl bg-white">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b-2 border-b-primary-50">
                <th className="p-5 text-left text-xs font-semibold">#</th>
                <th className="p-5 text-left text-xs font-semibold">Logo</th>
                <th className="p-5 text-left text-xs font-semibold">Nombre</th>
                <th className="p-5 text-left text-xs font-semibold">RUC</th>
                <th className="p-5 text-left text-xs font-semibold">
                  Dirección
                </th>
                <th className="p-5 text-left text-xs font-semibold">
                  Teléfono
                </th>
                <th className="p-5 text-left text-xs font-semibold">Correo</th>
                <th className="p-5 text-left text-xs font-semibold" />
              </tr>
            </thead>
            <tbody>
              {empresas.map(
                (
                  { id, logo, nombre, ruc, direccion, telefono, email },
                  index
                ) => {
                  return (
                    <tr key={index}>
                      <td className="p-5">
                        <p className="text-gray-900 whitespace-no-wrap">{id}</p>
                      </td>
                      <td className="p-5">
                        <div className="flex-shrink-0 w-10 h-10">
                          <Image
                            className="w-full h-full rounded-full"
                            src={logo}
                            alt=""
                            width={40}
                            height={40}
                          />
                        </div>
                      </td>
                      <td className="p-5">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {nombre}
                        </p>
                      </td>
                      <td className="p-5">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {ruc}
                        </p>
                      </td>
                      <td className="p-5">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {direccion}
                        </p>
                      </td>
                      <td className="p-5">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {telefono}
                        </p>
                      </td>
                      <td className="p-5">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {email}
                        </p>
                      </td>
                      <td className="p-5 flex gap-2">
                        <ButtonEdit onClick={"hola"} />
                        <ButtonDelete onClick={"hola"} />
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </Container>
      {/* Modal */}
      <Transition appear show={isOpenModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-[1000px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 "
                  >
                    Nueva empresa
                  </Dialog.Title>
                  <Dialog.Description></Dialog.Description>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
