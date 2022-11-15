import {
	Bag,
	ClipboardText,
	Image,
	Setting3,
	Shop,
	TransmitSqaure2,
} from "iconsax-react";
import Link from "next/link";
import { useRef, useState } from "react";

export default function Sidebar() {

  const refMantenimiento = useRef(null);
  const refVMostrador = useRef(null);
  const refVServicio = useRef(null);
  const refCompras = useRef(null);
  const refInventario = useRef(null);

	const menu = [
		{
			name: "Mantenimiento",
			href: "#",
			icon: <Setting3 />,
			ref: refMantenimiento,
		},
		{
			name: "Venta Mostrador",
			href: "#",
			icon: <Shop />,
			ref: refVMostrador,
		},
		{
			name: "Venta Servicio",
			href: "#",
			icon: <TransmitSqaure2 />,
			ref: refVServicio,
		},
		{ name: "Comprar", href: "#", icon: <Bag />, ref: refCompras },
		{
			name: "Inventario",
			href: "#",
			icon: <ClipboardText />,
			ref: refInventario,
		},
	];

  const handleShowLabelMenu = (ref) => {
    ref.current.classList.toggle("hidden");
  }

	return (
		<div className="flex flex-col h-screen bg-primary py-5 px-[30px] gap-8 shadow-lg items-center w-[100px] overflow-x-visible z-50">
			<div className="w-[30px] h-[30px] bg-gray-300 rounded-full flex items-center justify-center text-primary">
				<Image size="16" alt="user" />
			</div>
			<div className="h-0 w-full border border-primary-800 flex-none" />
			<div className="flex flex-col items-start w-full gap-10 overflow-x-visible">
				{menu.map((item, index) => (
					<Link
						href="/"
						key={index}
						className="relative flex gap-3 p-2 h-[40px] w-[40px] hover:bg-secundary rounded-xl hover:text-primary"
						onMouseEnter={() => {
							handleShowLabelMenu(item.ref);
						}}
            onMouseLeave={() => {
              handleShowLabelMenu(item.ref);
            }}
					>
						{item.icon}
						<p
							ref={item.ref}
							className="rounded-r-xl hidden absolute top-0 left-3/4 w-[200px] bg-secundary p-2 pl-3 text-ellipsis whitespace-nowrap overflow-hidden"
						>
							{item.name}
						</p>
					</Link>
				))}
			</div>
		</div>
	);
}
