import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { NewButton } from "../../../components/buttons/NewButton";
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
					<NewButton text={"Nueva empresa"} onClick={openModal} />
				</Title>

				<div class="overflow-x-auto relative shadow-md sm:rounded-lg">
					<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
						<caption class="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
							Our products
							<p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
								Browse a list of Flowbite products designed to
								help you work and play, stay organized, get
								answers, keep in touch, grow your business, and
								more.
							</p>
						</caption>
						<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
							<tr>
								<th scope="col" class="py-3 px-6">
									Product name
								</th>
								<th scope="col" class="py-3 px-6">
									Color
								</th>
								<th scope="col" class="py-3 px-6">
									Category
								</th>
								<th scope="col" class="py-3 px-6">
									Price
								</th>
								<th scope="col" class="py-3 px-6">
									<span class="sr-only">Edit</span>
								</th>
							</tr>
						</thead>
						<tbody>
							<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
								<th
									scope="row"
									class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
								>
									Apple MacBook Pro 17
								</th>
								<td class="py-4 px-6">Sliver</td>
								<td class="py-4 px-6">Laptop</td>
								<td class="py-4 px-6">$2999</td>
								<td class="py-4 px-6 text-right">
									<a
										href="#"
										class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
									>
										Edit
									</a>
								</td>
							</tr>
							<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
								<th
									scope="row"
									class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
								>
									Microsoft Surface Pro
								</th>
								<td class="py-4 px-6">White</td>
								<td class="py-4 px-6">Laptop PC</td>
								<td class="py-4 px-6">$1999</td>
								<td class="py-4 px-6 text-right">
									<a
										href="#"
										class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
									>
										Edit
									</a>
								</td>
							</tr>
							<tr class="bg-white dark:bg-gray-800">
								<th
									scope="row"
									class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
								>
									Magic Mouse 2
								</th>
								<td class="py-4 px-6">Black</td>
								<td class="py-4 px-6">Accessories</td>
								<td class="py-4 px-6">$99</td>
								<td class="py-4 px-6 text-right">
									<a
										href="#"
										class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
									>
										Edit
									</a>
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
