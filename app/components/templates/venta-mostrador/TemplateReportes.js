import { Chart2 } from "iconsax-react";
import { Container, ContainerMenu, Content } from "../../elements/Containers";
import { Title } from "../../elements/Title";
import LayoutSubSubMenu from "../../layouts/LayoutSubSubMenu";

export default function TemplateReportes({ children }) {
  const items = [
    {
      icon: <Chart2 />,
      modulo: "Margen de venta",
      href: "/venta-mostrador/reportes-estadistica/margen-de-venta",
    },
    {
      icon: <Chart2 />,
      modulo: "Record de Clientes",
      href: "/venta-mostrador/reportes-estadistica/record-de-clientes",
    },
    {
      icon: <Chart2 />,
      modulo: "R. de proveedores",
      href: "/venta-mostrador/reportes-estadistica/record-de-proveedores",
    },
    {
      icon: <Chart2 />,
      modulo: "Stock Mínimo",
      href: "/venta-mostrador/reportes-estadistica/stock-minimo",
    },
    {
      icon: <Chart2 />,
      modulo: "Parte Mensual",
      href: "/venta-mostrador/reportes-estadistica/parte-mensual",
    },
  ];

  return (
    <Container>
      <Title text={"Reportes"} />
      <ContainerMenu>
        <LayoutSubSubMenu items={items} />
        <Content>{children}</Content>
      </ContainerMenu>
    </Container>
  );
}
