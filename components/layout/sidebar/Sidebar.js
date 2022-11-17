import {
	Bag,
	ClipboardText,
	Image,
	Setting3,
	Shop,
	TransmitSqaure2,
} from "iconsax-react";
import { useRef, useState } from "react";
import SubMenuLayout from "../../submenus/SubMenuLayout";

export const Sidebar = () => {
	const refMantenimiento = useRef(null);
	const refVMostrador = useRef(null);
	const refVServicio = useRef(null);
	const refCompras = useRef(null);
	const refInventario = useRef(null);

	const menu = [
		{
			modulo: "Mantenimiento",
			icon: <Setting3 />,
			ref: refMantenimiento,
			submenu: [
				{
					subItem: "Datos de la empresa",
					href: "/mantenimiento/datos-empresa",
				},
				{
					subItem: "Maestro de códigos",
					href: "/mantenimiento/maestro-codigos",
				},
				{
					subItem: "General",
					href: "/mantenimiento/general",
				},
				{
					subItem: "Administrativos",
					href: "/mantenimiento/administrativos",
				},
				{
					subItem: "Importación",
					href: "/mantenimiento/importacion",
				},
				{
					subItem: "Inventario",
					href: "/mantenimiento/inventario",
				},
				{
					subItem: "Comercial",
					href: "/mantenimiento/comercial",
				},
				{
					subItem: "Presupuesto",
					href: "/mantenimiento/presupuesto",
				},
			],
		},
		{
			modulo: "Venta Mostrador",
			icon: <Shop />,
			ref: refVMostrador,
			submenu: [
				{
					subItem: "Mostrador 1",
				},
			],
		},
		{
			modulo: "Venta Servicio",
			icon: <TransmitSqaure2 />,
			ref: refVServicio,
			submenu: [
				{
					subItem: "Servicio 1",
				},
			],
		},
		{
			modulo: "Comprar",
			icon: <Bag />,
			ref: refCompras,
			submenu: [
				{
					subItem: "Comprar 1",
				},
			],
		},
		{
			modulo: "Inventario",
			icon: <ClipboardText />,
			ref: refInventario,
			submenu: [
				{
					subItem: "Inventario 1",
				},
			],
		},
	];
	const [isActive, setIsActive] = useState({ active: false, indexTemp: 0 });
	const [showSubMenu, setShowSubMenu] = useState(false);
	const [subMenu, setSubMenu] = useState([]);

	const handleShowLabelMenu = (ref) => {
		ref.current.classList.toggle("hidden");
	};

	const handleClick = (index) => {
		setIsActive({ active: true, indexTemp: index });
	};

	const handleHover = () =>{

	}

	return (
		<div
			className="flex flex-col h-screen bg-primary py-5 px-[30px] gap-8 shadow-lg items-center w-[100px] overflow-x-visible z-40 text-white"
			onMouseEnter={() => {
				setShowSubMenu(showSubMenu ? true : false);
			}}
			onMouseLeave={() => {
				setShowSubMenu(false);
			}}
		>
			<div className="w-[30px] h-[30px] bg-gray-300 rounded-full flex items-center justify-center text-primary">
				<Image size="16" alt="user" />
			</div>
			<div className="h-0 w-full border border-primary-800 flex-none" />
			<div className="flex flex-col items-start w-full gap-10 overflow-x-visible">
				{menu.map((item, index) => (
					<button
						type="button"
						key={index}
						className={`relative flex gap-3 p-2 h-[40px] w-[40px] hover:bg-secundary rounded-[10px] hover:text-primary z-50 ${
							isActive.indexTemp === index && isActive.active
								? "bg-secundary text-primary"
								: ""
						}`}
						onMouseEnter={() => {
							handleShowLabelMenu(item.ref);
						}}
						onMouseLeave={() => {
							handleShowLabelMenu(item.ref);
						}}
						onClick={() => {
							handleClick(index);
							setShowSubMenu(true);
							setSubMenu(item);
						}}
					>
						{item.icon}
						<p
							ref={item.ref}
							className="rounded-r-xl hidden absolute top-0 left-[80%] w-[200px] bg-secundary p-2 pl-3 text-ellipsis whitespace-nowrap overflow-hidden text-left"
						>
							{item.modulo}
						</p>
					</button>
				))}
				{showSubMenu && (
					<SubMenuLayout
						item={subMenu}
						setShowSubMenu={setShowSubMenu}
					/>
				)}
			</div>
		</div>
	);
}
