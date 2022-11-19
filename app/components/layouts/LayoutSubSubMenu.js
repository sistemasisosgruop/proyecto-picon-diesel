import Link from "next/link";
import { useRouter } from "next/router";

export default function LayoutSubSubMenu({items}) {

  const route = useRouter();

  return (
    <div className="flex flex-col min-w-[250px] gap-3">
    {
      items.map(({icon, modulo, href}, index) => (
        <Link key={index} className={`w-full flex items-center p-3 gap-[10px] bg-white shadow-md rounded-lg text-primary ${route.pathname === href ? 'bg-primary-200': 'bg-white'}`} href={href}>
            {icon}
            {modulo}
        </Link>
      ))}

    </div>
  )
}