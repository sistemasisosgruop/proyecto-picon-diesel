import { Menu } from "@headlessui/react";
import { ArrowDown2, LogoutCurve, Setting, User } from "iconsax-react";
import { Fragment } from "react";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export const Header = () => {
	const itemsDropdown = [
		{ name: "Profile", href: "#", icon: <User /> },
		{ name: "Settings", href: "#", icon: <Setting /> },
		{ name: "Sign out", href: "#", icon: <LogoutCurve /> },
	];
	return (
		<header className="flex items-center justify-end px-8 py-3 bg-white shadow-lg">
			<Menu as="div" className="relative select-none">
				<Menu.Button className="flex items-center text-primary gap-4">
					<div className="rounded-full w-[50px] h-[50px] bg-gray-300 text-gray-400 flex justify-center items-center">
						<User />
					</div>
					<div className="flex flex-col items-start">
						<h1 className="font-semibold">Nombre Apellido</h1>
						<label className="text-gray-400 text-[11px]">
							Administrador
						</label>
					</div>
					<ArrowDown2 />
				</Menu.Button>
				<Menu.Items className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg">
					{itemsDropdown.map((item, index) => (
						<Menu.Item key={index} as={Fragment}>
							<a
								href
								className="flex gap-2 items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							>
								{item.icon}
								{item.name}
							</a>
						</Menu.Item>
					))}
				</Menu.Items>
			</Menu>
		</header>
	);
};
