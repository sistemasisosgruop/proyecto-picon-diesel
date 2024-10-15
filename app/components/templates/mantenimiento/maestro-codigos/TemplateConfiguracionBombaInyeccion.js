import { Box1 } from "iconsax-react";
import { Content } from "../../../elements/Containers";
import { LayoutConfiguracion } from "../../../layouts/LayoutConfiguracion";

export const TemplateConfiguracionBombaInyeccion = ({ children }) => {
	const menu = [
		// {
		// 	icon: <Box1 />,
		// 	modulo: "Marcas de fabrica sistema inyeccion",
		// 	href: "/mantenimiento/maestro-de-codigos/configuracion/bomba-inyeccion/marca",
		// },
		{
			icon: <Box1 />,
			modulo: "Descripción de bomba de inyeccion",
			href: "/mantenimiento/maestro-de-codigos/configuracion/bomba-inyeccion/descripcion",
		},
	];

	return (
		<>
			<LayoutConfiguracion items={menu} />
			<Content>{children}</Content>
		</>
	);
};
