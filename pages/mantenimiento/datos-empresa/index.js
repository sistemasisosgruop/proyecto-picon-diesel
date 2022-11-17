import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment, useState } from "react";
import { ButtonEdit } from "../../../components/buttons/ButtonEdit";
import { ButtonNew } from "../../../components/buttons/ButtonNew";
import { Container } from "../../../components/container/Container";
import { Title } from "../../../components/title/Title";

export default function DatosEmpresa() {
	const [isOpenModal, setIsOpenModal] = useState(false);

	const closeModal = () => {
		setIsOpenModal(false);
	};

	const openModal = () => {
		setIsOpenModal(true);
		console.log(
			"🚀 ~ file: index.js ~ line 10 ~ DatosEmpresa ~ isOpenModal",
			isOpenModal
		);
	};

	return (
		<>
			<Container bg={"bg-white"}>
				<Title>
					<h1 className="text-2xl font-semibold">Empresas</h1>
					<ButtonNew text={"Nueva empresa"} onClick={openModal} />
				</Title>
				{/* Table */}
				<div className="overflow-x-auto w-full">
					<table className="w-full whitespace-nowrap">
						<thead className="border-b border-t border-primary-400">
							<tr className="text-primary">
								<th className="px-5 py-3 text-left text-xs font-semibold tracking-wider">
									#
								</th>
								<th className="px-5 py-3 text-left text-xs font-semibold tracking-wider">
									Logo
								</th>
								<th className="px-5 py-3 text-left text-xs font-semibold tracking-wider">
									Nombre
								</th>
								<th className="px-5 py-3 text-left text-xs font-semibold tracking-wider">
									RUC
								</th>
								<th className="px-5 py-3 text-left text-xs font-semibold tracking-wider">
									Dirección
								</th>
								<th className="px-5 py-3 text-left text-xs font-semibold tracking-wider">
									Teléfono
								</th>
								<th className="px-5 py-3 text-left text-xs font-semibold tracking-wider">
									Correo
								</th>
								<th className="px-5 py-3 text-left text-xs font-semibold tracking-wider" />
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
									<p className="text-gray-900 whitespace-no-wrap">
										1
									</p>
								</td>
								<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
									<div className="flex-shrink-0 w-10 h-10">
										<Image
											className="w-full h-full rounded-full"
											src=""
											alt=""
											width={40}
											height={40}
										/>
									</div>
								</td>
								<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
									<p className="text-gray-900 whitespace-no-wrap">
										Admin
									</p>
								</td>
								<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
									<p className="text-gray-900 whitespace-no-wrap">
										Jan 21, 2020
									</p>
								</td>
								<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
									<p className="text-gray-900 whitespace-no-wrap">
										Jan 21, 2020
									</p>
								</td>
								<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
									<p className="text-gray-900 whitespace-no-wrap">
										Jan 21, 2020
									</p>
								</td>
								<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
									<p className="text-gray-900 whitespace-no-wrap">
										Jan 21, 2020
									</p>
								</td>
								<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
									<ButtonEdit onClick={"hola"} />
								</td>
							</tr>
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
								<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
									<Dialog.Title
										as="h3"
										className="text-lg font-medium leading-6 text-gray-900"
									>
										Payment successful
									</Dialog.Title>
									<div className="mt-2">
										<p className="text-sm text-gray-500">
											Your payment has been successfully
											submitted. We’ve sent you an email
											with all of the details of your
											order.
										</p>
									</div>

									<div className="mt-4">
										<button
											type="button"
											className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
											onClick={closeModal}
										>
											Got it, thanks!
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
}
