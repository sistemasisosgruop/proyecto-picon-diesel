import { Box1 } from "iconsax-react";
import { Content } from "../../../elements/Containers";
import { LayoutConfiguracion } from "../../../layouts/LayoutConfiguracion";

export const TemplateConfiguracionInyector = ({ children }) => {
	const menu = [
		{
			icon: <Box1 />,
			modulo: "Marcas de fabricas de inyector",
			href: "/mantenimiento/maestro-de-codigos/configuracion/inyector/marca",
		},
		{
			icon: <Box1 />,
			modulo: "Descripción Inyector",
			href: "/mantenimiento/maestro-de-codigos/configuracion/inyector/descripcion",
		},
	];

	return (
		<>
			<LayoutConfiguracion items={menu} />
			<Content>{children}</Content>
		</>
	);
};
