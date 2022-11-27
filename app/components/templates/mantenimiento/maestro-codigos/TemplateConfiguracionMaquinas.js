import { Box1, Setting, TableDocument } from "iconsax-react";
import { Content } from "../../../elements/Containers";
import { LayoutConfiguracion } from "../../../layouts/LayoutConfiguracion";

export const TemplateConfiguracionMaquinas = ({ children }) => {
	const menu = [
		{
			icon: <Box1 />,
			modulo: "Modelos de máquinas",
			href: "/mantenimiento/maestro-de-codigos/configuracion/maquinas/modelos",
		},
		{
			icon: <Setting />,
			modulo: "Fábrica de máquinas",
			href: "/mantenimiento/maestro-de-codigos/configuracion/maquinas/fabricas",
		},
		{
			icon: <TableDocument />,
			modulo: "Nombre de máquinas",
			href: "/mantenimiento/maestro-de-codigos/configuracion/maquinas/nombres",
		},
	];

	return (
		<>
			<LayoutConfiguracion items={menu} />
			<Content>{children}</Content>
		</>
	);
};
