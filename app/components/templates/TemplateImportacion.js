import {
	ChemicalGlass,
	Coin,
	SecurityUser,
	Ship,
	TaskSquare,
} from "iconsax-react";
import { Container, ContainerMenu, Content } from "../elements/Containers";
import { Title } from "../elements/Title";
import LayoutSubSubMenu from "../layouts/LayoutSubSubMenu";

export default function TemplateImportacion({ children }) {
	const items = [
		{
			icon: <SecurityUser />,
			modulo: "Agente de Aduanas",
			href: "/mantenimiento/importacion/agente-de-aduanas",
		},
		{
			icon: <TaskSquare />,
			modulo: "Incoterms",
			href: "/mantenimiento/importacion/incoterms",
		},
		{
			icon: <Ship />,
			modulo: "Tipos de vías",
			href: "/mantenimiento/importacion/tipos-de-vias",
		},
		{
			icon: <Coin />,
			modulo: "Gastos de importación",
			href: "/mantenimiento/importacion/gastos-de-importacion",
		},
		{
			icon: <ChemicalGlass />,
			modulo: "Factor de internamiento",
			href: "/mantenimiento/importacion/factor-de-internamiento",
		}
	];

	return (
		<Container>
			<Title text={"Importación"} />
			<ContainerMenu>
				<LayoutSubSubMenu items={items} />
				<Content>{children}</Content>
			</ContainerMenu>
		</Container>
	);
}
