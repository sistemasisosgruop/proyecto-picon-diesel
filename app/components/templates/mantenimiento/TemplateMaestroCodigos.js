import {
	Box,
	Box2,
	Layer,
	Setting2,
	TaskSquare,
} from "iconsax-react";
import { Container, ContainerMenu, Content } from "../../elements/Containers";
import { Title } from "../../elements/Title";
import LayoutSubSubMenu from "../../layouts/LayoutSubSubMenu";

export default function TemplateMaestroCodigos({ children }) {
	const items = [
		{
			icon: <Layer />,
			modulo: "Familias",
			href: "/mantenimiento/maestro-de-codigos/familias",
		},
		{
			icon: <TaskSquare />,
			modulo: "Características",
			href: "/mantenimiento/maestro-de-codigos/caracteristicas",
		},
		{
			icon: <Box2 />,
			modulo: "Máquinas",
			href: "/mantenimiento/maestro-de-codigos/maquinas",
		},
		{
			icon: <Box />,
			modulo: "Materiales",
			href: "/mantenimiento/maestro-de-codigos/materiales",
		},
		{
			icon: <Setting2 />,
			modulo: "Configuración de máquinas",
			href: "/mantenimiento/maestro-de-codigos/configuracion/maquinas/modelos",
		},
		{
			icon: <Setting2 />,
			modulo: "Configuración de motor",
			href: "/mantenimiento/maestro-de-codigos/configuracion-de-motor",
		},
		{
			icon: <Setting2 />,
			modulo: "Configuración de Bomba de inyección",
			href: "/mantenimiento/maestro-de-codigos/configuracion-de-bomba-de-inyeccion",
		},
		{
			icon: <Setting2 />,
			modulo: "Configuración de Inyector",
			href: "/mantenimiento/maestro-de-codigos/configuracion-de-inyector",
		},
	];

	return (
		<Container>
			<Title text={"Maestro de Códigos"} />
			<ContainerMenu>
				<LayoutSubSubMenu items={items} />
				<Content>{children}</Content>
			</ContainerMenu>
		</Container>
	);
}
