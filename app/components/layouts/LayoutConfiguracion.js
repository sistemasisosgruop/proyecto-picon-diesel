import Link from "next/link";
import { useRouter } from "next/router";

export const LayoutConfiguracion = ({items}) => {

  const route = useRouter();

  return (
		<div
			className="flex w-full overflow-y-auto sticky -top-8 gap-3 h-auto py-4 z-50 bg-white" 
		>
			{items.map(({ icon, modulo, href }, index) => (
				<Link
					key={index}
					className={`w-full flex items-center p-3 gap-[10px] bg-white text-sm font-normal shadow-md rounded-lg text-primary border ${
						route.pathname === href ? "bg-primary-200" : "bg-white"
					}`}
					href={href}
				>
					{icon}
					{modulo}
				</Link>
			))}
		</div>
  );
}