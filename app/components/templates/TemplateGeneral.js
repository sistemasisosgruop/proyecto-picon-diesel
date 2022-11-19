import { ColorsSquare, Global } from "iconsax-react";
import { Container, ContainerMenu, Content } from "../elements/Containers";
import { Title } from "../elements/Title";
import LayoutSubSubMenu from "../layouts/LayoutSubSubMenu";

export default function TemplateGeneral({children}) {

  const items = [
		{
			icon: <Global />,
			modulo: "Paises",
      href: "/mantenimiento/general/paises",
		},
		{
			icon: <ColorsSquare />,
			modulo: "Parámetros globales",
      href: "/mantenimiento/general/parametros-globales",
		},
  ];

  return (
		<Container>
			<Title text={"General"} />
			<ContainerMenu>
				<LayoutSubSubMenu items={items} />
				<Content>
					{children}
				</Content>
			</ContainerMenu>
		</Container>
  );
}