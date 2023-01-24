import { Setting3, Shop } from "iconsax-react";

export const menuSidebar = [
  {
    modulo: "Mantenimiento",
    icon: <Setting3 />,
    submenu: [
      {
        subItem: "Datos de la empresa",
        href: "/mantenimiento/datos-empresa",
      },
      {
        subItem: "Sucursales",
        href: "/mantenimiento/sucursales",
      },
      {
        subItem: "Maestro de códigos",
        href: "/mantenimiento/maestro-de-codigos/familias",
      },
      {
        subItem: "General",
        href: "/mantenimiento/general/paises",
      },
      {
        subItem: "Administrativos",
        href: "/mantenimiento/administrativo/personal",
      },
      {
        subItem: "Importación",
        href: "/mantenimiento/importacion/agente-de-aduanas",
      },
      {
        subItem: "Inventario",
        href: "/mantenimiento/inventario/almacenes",
      },
      {
        subItem: "Comercial",
        href: "/mantenimiento/comercial/tipo-de-cambio",
      },
      {
        subItem: "Presupuesto",
        href: "/mantenimiento/presupuesto/servicios",
      },
    ],
  },
  {
    modulo: "Venta Mostrador",
    icon: <Shop />,
    submenu: [
      {
        subItem: "Cotizaciones",
        href: "/venta-mostrador/cotizaciones",
      },
      {
        subItem: "Aprobación de cotizaciones",
        href: "/venta-mostrador/aprobacion-de-cotizaciones",
      },
      {
        subItem: "Aprobación de pedidos",
        href: "/venta-mostrador/aprobacion-de-pedidos",
      },
      {
        subItem: "Guia de remision",
        href: "/venta-mostrador/guia-de-remision",
      },
      {
        subItem: "Venta - Facturación",
        href: "/venta-mostrador/venta-facturacion",
      },
      {
        subItem: "Reportes y estadistica",
        href: "/venta-mostrador/reportes-estadistica/margen-de-venta",
      },
    ],
  },
  // {
  //   modulo: "Venta Servicio",
  //   icon: <TransmitSqaure2 />,
  //   submenu: [
  //     {
  //       subItem: "Servicio 1",
  //       href: "/venta-servicio/servicio-1",
  //     },
  //   ],
  // },
  // {
  //   modulo: "Comprar",
  //   icon: <Bag />,
  //   submenu: [
  //     {
  //       subItem: "Comprar 1",
  //       href: "/comprar/comprar-1",
  //     },
  //   ],
  // },
  // {
  //   modulo: "Inventario",
  //   icon: <ClipboardText />,
  //   submenu: [
  //     {
  //       subItem: "Inventario 1",
  //       href: "/inventario/inventario-1",
  //     },
  //   ],
  // },
];
