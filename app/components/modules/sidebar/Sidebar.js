import {Tooltip } from "@material-tailwind/react";
import {
  Image,
} from "iconsax-react";
import { useRouter } from "next/router";
import { useState,useEffect, use } from "react";
import { menuSidebar } from "../../../utils/MenuSidebar";									//!
import { SelectEmpresas } from "../../elements/SelectEmpresas";
// import { Empresas } from "../../elements/icons/Empresas";
import LayoutSubMenu from "../../layouts/LayoutSubMenu";

export const Sidebar = () => {

  const [isActive, setIsActive] = useState({ active: false, indexTemp: 0 });	//Gestión del estado del botón clickeado
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [subMenu, setSubMenu] = useState([]);
  const [imagenLogo, setImagenLogo] = useState("");
  
  useEffect(()=>{
	let imgLogo = localStorage.getItem("empresaLogo");
	imgLogo = imgLogo.replace(/"/g, '');

	// console.log('Logo en imgLogoLocalStorage:',imgLogo);
	if (imgLogo){
		setImagenLogo(imgLogo);
	}
	
  },[])

  const handleClick = (index) => {			//! Cambia estado de submenu para ver si ha sido clickeado y activa.
    setIsActive({ active: true, indexTemp: index });
  };

  const router = useRouter();

  return (
		<div
			className="flex flex-col h-screen bg-primary py-5 px-[30px] gap-8 shadow-lg items-center w-[100px] overflow-x-visible z-40 text-white"
			onMouseEnter={() => {
				setShowSubMenu(!!showSubMenu);
			}}
			onMouseLeave={() => {
				setShowSubMenu(false);
			}}
		>

			<div className="w-[50px] h-[50px]  rounded-full flex items-center justify-center text-primary z-500">
				
				<img width={40} height={40} src={imagenLogo || "/images/empresa.png"} className="rounded-full" alt="empresa"  style={{objectFit: 'cover', width: '100%', height: '100%' }} />	
		
			</div>

			<div className="h-0 w-full border border-primary-800 flex-none" />
			
			<div className="flex flex-col items-center w-[100%] gap-10 overflow-x-visible">
				
				<SelectEmpresas />

				{menuSidebar.map((item, index) => (
					<Tooltip
						key={index}
						className="rounded-r-xl w-[200px] bg-secundary p-2 pl-3 text-ellipsis whitespace-nowrap overflow-hidden text-left text-primary h-[40px] absolute text-lg -left-3"
						content={item.modulo}
						placement="right-end"
					>
						<button
							type="button"
							className={`relative flex gap-3 p-2 h-[40px] w-[40px] hover:bg-secundary rounded-[10px] hover:text-primary z-50 ${
								(isActive.indexTemp === index &&
									isActive.active) ||
								router.pathname.split("/")[1] ===
									item.modulo.toLowerCase()
									? "bg-secundary text-primary"
									: ""
							}`}
							onClick={() => {
								handleClick(index);
								setShowSubMenu(true);
								setSubMenu(item);
							}}
						>
							{item.icon}
						</button>
					</Tooltip>
				))}
				{showSubMenu && (
					<LayoutSubMenu
						item={subMenu}
						setShowSubMenu={setShowSubMenu}
					/>
				)}
			</div>
		</div>
  );
};
