import {
	BackwardItem,
	BoxTick,
	Category2,
	Receive,
	Setting2
} from "iconsax-react";
import { Container, ContainerMenu, Content } from "../../elements/Containers";
import { Title } from "../../elements/Title";
import LayoutSubSubMenu from "../../layouts/LayoutSubSubMenu";

export default function TemplatePresupuesto({ children }) {
	const items = [
		{
			icon: <Setting2 />,
			modulo: "Tipo de reparación",
			href: "/mantenimiento/presupuesto/tipos-de-reparacion",
		},
		{
			icon: <BoxTick />,
			modulo: "Familias",
			href: "/mantenimiento/presupuesto/familias",
		},
		{
			icon: <Category2 />,
			modulo: "Materiales",
			href: "/mantenimiento/presupuesto/materiales",
		},
		{
			icon: <BackwardItem />,
			modulo: "Servicios",
			href: "/mantenimiento/presupuesto/servicios",
		},
		{
			icon: <Receive />,
			modulo: "Trabajo terceros",
			href: "/mantenimiento/presupuesto/trabajo-terceros",
		},
	];

	return (
		<Container>
			<Title text={"Servicio"} />
			<ContainerMenu>
				<LayoutSubSubMenu items={items} />
				<Content>{children}</Content>
			</ContainerMenu>
		</Container>
	);
}
