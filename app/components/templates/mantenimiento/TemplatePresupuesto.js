import {
	BackwardItem,
	BoxTick,
	Category2,
	Receive,
} from "iconsax-react";
import { Container, ContainerMenu, Content } from "../../elements/Containers";
import { Title } from "../../elements/Title";
import LayoutSubSubMenu from "../../layouts/LayoutSubSubMenu";

export default function TemplatePresupuesto({ children }) {
	const items = [
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
			<Title text={"Presupuesto"} />
			<ContainerMenu>
				<LayoutSubSubMenu items={items} />
				<Content>{children}</Content>
			</ContainerMenu>
		</Container>
	);
}
