import {
  BackSquare,
  BitcoinConvert,
  BookSquare,
  DiscountCircle,
  EmptyWalletChange,
  Folder,
} from "iconsax-react";
import { Container, ContainerMenu, Content } from "../../elements/Containers";
import { Title } from "../../elements/Title";
import LayoutSubSubMenu from "../../layouts/LayoutSubSubMenu";

export default function TemplateComercial({ children }) {
  const items = [
    {
      icon: <BitcoinConvert />,
      modulo: "Tipo de cambio",
      href: "/mantenimiento/comercial/tipo-de-cambio",
    },
    {
      icon: <DiscountCircle />,
      modulo: "Parametro de descuento",
      href: "/mantenimiento/comercial/parametro-de-descuento",
    },
    {
      icon: <EmptyWalletChange />,
      modulo: "Formas de pago",
      href: "/mantenimiento/comercial/formas-de-pago",
    },
    {
      icon: <Folder />,
      modulo: "Documentos contables",
      href: "/mantenimiento/comercial/documentos-contables",
    },
    {
      icon: <BackSquare />,
      modulo: "Detracciones",
      href: "/mantenimiento/comercial/detracciones",
    },
    {
      icon: <BookSquare />,
      modulo: "Motivo de traslado guia de remision",
      href: "/mantenimiento/comercial/motivo-guia-remision",
    },
  ];

  return (
    <Container>
      <Title text={"Comercial"} />
      <ContainerMenu>
        <LayoutSubSubMenu items={items} />
        <Content>{children}</Content>
      </ContainerMenu>
    </Container>
  );
}
