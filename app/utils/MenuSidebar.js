import { Bag, ClipboardText, Setting3, Shop, TransmitSqaure2 } from "iconsax-react";

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
          subItem: "Maestro de códigos",
          href: "/mantenimiento/maestro-codigos",
        },
        {
          subItem: "General",
          href: "/mantenimiento/general",
        },
        {
          subItem: "Administrativos",
          href: "/mantenimiento/administrativos",
        },
        {
          subItem: "Importación",
          href: "/mantenimiento/importacion",
        },
        {
          subItem: "Inventario",
          href: "/mantenimiento/inventario",
        },
        {
          subItem: "Comercial",
          href: "/mantenimiento/comercial",
        },
        {
          subItem: "Presupuesto",
          href: "/mantenimiento/presupuesto",
        },
      ],
    },
    {
      modulo: "Venta Mostrador",
      icon: <Shop />,
      submenu: [
        {
          subItem: "Mostrador 1",
          href: "/venta-mostrador/mostrador-1",
        },
      ],
    },
    {
      modulo: "Venta Servicio",
      icon: <TransmitSqaure2 />,
      submenu: [
        {
          subItem: "Servicio 1",
          href: "/venta-servicio/servicio-1",
        },
      ],
    },
    {
      modulo: "Comprar",
      icon: <Bag />,
      submenu: [
        {
          subItem: "Comprar 1",
          href: "/comprar/comprar-1",
        },
      ],
    },
    {
      modulo: "Inventario",
      icon: <ClipboardText />,
      submenu: [
        {
          subItem: "Inventario 1",
          href: "/inventario/inventario-1",
        },
      ],
    },
  ];