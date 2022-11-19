import Link from "next/link";
import { useRouter } from "next/router";

export default function LayoutSubSubMenu({items}) {

  const route = useRouter();

  return (
    <div className="flex flex-col w-[250px] overflow-y-auto sticky -top-8 gap-3" style={{height: "calc(100vh - 100px)"}}>
    {
      items.map(({icon, modulo, href}, index) => (
        <Link key={index} className={`w-full flex items-center p-3 gap-[10px] bg-white text-sm font-normal shadow-md rounded-lg text-primary ${route.pathname === href ? 'bg-primary-200': 'bg-white'}`} href={href}>
            {icon}
            {modulo}
        </Link>
      ))}

    </div>
  )
}