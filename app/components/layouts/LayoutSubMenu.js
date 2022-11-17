import Link from "next/link";

export default function LayoutSubMenu({ item }) {
  const { modulo, icon, submenu } = item;
  return (
    <div className="absolute top-0 left-[100px] w-[250px] bg-primary-800 h-screen z-40 p-[23px]">
      <div className="flex flex-col items-center gap-[10px] w-full">
        <div className="flex items-start p-[10px] gap-[10px] w-full text-secundary">
          {icon}
          {modulo}
        </div>
        <div className="h-0 w-full border border-primary flex-none" />
        <div className="flex flex-col w-full items-start gap-[15px]">
          {submenu.map(({ subItem, href }, index) => (
            <Link
              href={href}
              key={index}
              className="w-full font-normal flex items-start p-[10px] bg-primary rounded-lg text-xs hover:bg-secundary hover:text-primary"
            >
              {subItem}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
