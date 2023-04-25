import { createContext, useState } from "react";

export const VentaServiciosContext = createContext(null);

export const  VentaServiciosProvider = ({ children }) => {
    const [arreglosVentaServicios, setArreglosVentaServicios] = useState({
        materiales: [],
        servicios: [],
        repuestos: [],
        trabajosTerceros: []
    });

    const [codigosVentaServicios, setCodigosVentaServicios] = useState({
        materiales: [],
        servicios: [],
        repuestos: [],
        trabajosTerceros: []
    });

    const [arreglosRel, setArreglosRel] = useState({
        presupuestos: []
    })

    const [isOpenArreglos, setIsOpenArreglos] = useState({
        materiales: false,
        servicios: false,
        repuestos: false,
        trabajosTerceros: false
    })

    return (
        <VentaServiciosContext.Provider
            value={{
                arreglosVentaServicios,
                setArreglosVentaServicios,
                codigosVentaServicios,
                setCodigosVentaServicios,
                isOpenArreglos,
                setIsOpenArreglos,
                arreglosRel,
                setArreglosRel
            }}
        >
            {children}
        </VentaServiciosContext.Provider>
    )
}