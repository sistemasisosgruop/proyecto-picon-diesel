import {
  BoxSearch,
	House2,
	People,
  Truck,
  TruckFast,
} from "iconsax-react";
import { Container, ContainerMenu, Content } from "../elements/Containers";
import { Title } from "../elements/Title";
import LayoutSubSubMenu from "../layouts/LayoutSubSubMenu";

export default function TemplateInventario({ children }) {
	const items = [
		{
			icon: <House2 />,
			modulo: "Almacenes",
			href: "/mantenimiento/inventario/almacenes",
		},
		{
			icon: <BoxSearch />,
			modulo: "Motivo movimiento de almacén",
			href: "/mantenimiento/inventario/motivo-movimiento-almacen",
		},
		{
			icon: <TruckFast />,
			modulo: "Agencia de Transporte",
			href: "/mantenimiento/inventario/agencia-de-transporte",
		},
		{
			icon: <Truck />,
			modulo: "Vehículos",
			href: "/mantenimiento/inventario/vehiculos",
		},
		{
			icon: <People />,
			modulo: "Choferes",
			href: "/mantenimiento/inventario/choferes",
		},
	];

	return (
		<Container>
			<Title text={"Inventario"} />
			<ContainerMenu>
				<LayoutSubSubMenu items={items} />
				<Content>{children}</Content>
			</ContainerMenu>
		</Container>
	);
}
