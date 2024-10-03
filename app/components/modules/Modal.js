import { CloseCircle } from "iconsax-react";
import { Fragment, useContext, useState } from "react";
import { Divider } from "../elements/Divider";
import { Dialog, Transition } from "@headlessui/react";
import { MaterialesContext } from "../../../contexts/materiales.context";

export const Modal = ({ title, isOpen, closeModal, children }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
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
              <Dialog.Panel className="transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col gap-5">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 flex gap-5 justify-between items-center"
                >
                  {title}
                  <CloseCircle onClick={closeModal} className="cursor-pointer" />
                </Dialog.Title>
                <Divider />
                <Dialog.Description className="flex flex-col gap-9">{children}</Dialog.Description>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
export const ModalLg = ({ title, isOpen, closeModal, children }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
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
              <Dialog.Panel className="w-[91%] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col gap-5">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 flex justify-between items-center"
                >
                  {title}
                  <CloseCircle onClick={closeModal} className="cursor-pointer" />
                </Dialog.Title>
                <Divider />
                <Dialog.Description className="flex flex-col gap-9">{children}</Dialog.Description>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export const ModalMaterialDetalle = ({ children, title }) => {
  const { modalInfoIsOpen, closeInfoModal } = useContext(MaterialesContext);
  return (
    <Transition appear show={modalInfoIsOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => closeInfoModal()}>
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
              <Dialog.Panel className="w-[1000px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col gap-5">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 flex justify-between items-center"
                >
                  {title}
                  <CloseCircle onClick={() => closeInfoModal()} className="cursor-pointer" />
                </Dialog.Title>
                <Divider />
                <Dialog.Description className="flex flex-col gap-9">{children}</Dialog.Description>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export const ModalConfirmDelete = ({ title, isOpen, closeModal, onClick = undefined  }) => {
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all flex flex-col items-center">
                  <Dialog.Title
                    as="h3"
                    className="flex flex-col items-center text-lg font-medium leading-6 text-red-400"
                  >
                    <CloseCircle size={100} />
                    <h1>{title}</h1>
                  </Dialog.Title>
                  <Dialog.Description className="mt-4 flex flex-col gap-5">
                    <p>¿Está seguro de que desea eliminar este elemento?</p>
                    <div className="flex justify-center gap-4">
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-primary border rounded-md hover:bg-primary-50"
                        onClick={closeModal}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-400 hover:bg-red-500 rounded-md"
                        onClick={() => {
                          onClick();
                          setOpenConfirmDelete(false)
                          closeModal();
                        }}
                      >
                        Confirmar
                      </button>
                    </div>
                  </Dialog.Description>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {/* Confirm Delete  */}
      <Transition appear show={openConfirmDelete} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setOpenConfirmDelete(false)}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-green-50 p-6 align-middle shadow-xl transition-all flex flex-col  ">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Eliminado correctamente
                  </Dialog.Title>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={() => setOpenConfirmDelete(false)}
                    >
                      Hecho
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
