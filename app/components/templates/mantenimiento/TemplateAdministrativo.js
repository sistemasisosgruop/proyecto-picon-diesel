import { ArrangeHorizontalSquare, Bank, Card, Profile2User, Shop, UserOctagon, UserSquare } from "iconsax-react";
import { Container, ContainerMenu, Content } from "../../elements/Containers";
import { Title } from "../../elements/Title";
import LayoutSubSubMenu from "../../layouts/LayoutSubSubMenu";

export default function TemplateAdministrativo({children}) {

  const items = [
    {
      icon: <UserOctagon />,
      modulo: "Personal",
      href: "/mantenimiento/administrativo/personal",
    },
    // {
    //   icon: <Shop />,
    //   modulo: "Vendedores",
    //   href: "/mantenimiento/administrativo/vendedores",
    // },
    {
      icon: <UserSquare />,
      modulo: "Clientes",
      href: "/mantenimiento/administrativo/clientes",
    },
    {
      icon: <ArrangeHorizontalSquare />,
      modulo: "Centro de costos",
      href: "/mantenimiento/administrativo/centro-de-costos",
    },
    {
      icon: <Bank/>,
      modulo: "Bancos",
      href: "/mantenimiento/administrativo/bancos",
    },
    {
      icon: <Card />,
      modulo: "Cuentas bancarias",
      href: "/mantenimiento/administrativo/cuentas-bancarias",
    },
    {
      icon: <Profile2User />,
      modulo: "Tipos de clientes",
      href: "/mantenimiento/administrativo/tipos-de-clientes",
    }
  ]

  return (
		<Container>
			<Title text={"Administrativo"} />
			<ContainerMenu>
				<LayoutSubSubMenu items={items} />
				<Content>{children}</Content>
			</ContainerMenu>
		</Container>
  );
}