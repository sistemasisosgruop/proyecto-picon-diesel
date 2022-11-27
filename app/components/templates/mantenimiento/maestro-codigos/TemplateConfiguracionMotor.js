import { Box1 } from "iconsax-react";
import { Content } from "../../../elements/Containers";
import { LayoutConfiguracion } from "../../../layouts/LayoutConfiguracion";

export const TemplateConfiguracionMotor = ({ children }) => {
	const menu = [
		{
			icon: <Box1 />,
			modulo: "Marcas de motor",
			href: "/mantenimiento/maestro-de-codigos/configuracion/motor/marcas",
		},		
	];

	return (
		<>
			<LayoutConfiguracion items={menu} />
			<Content>{children}</Content>
		</>
	);
};
