"use-client"

import { createContext, useState } from "react";

export const VentaMostradorContext = createContext(null);

export const VentaMostradorProvider = ({ children }) => {
    const [arreglosVenta, setArreglosVenta] = useState({
        clientes: [],
        cotizaciones: [],
        codigos: [],
        materiales: [],
        cotizacionesAprobadas: []
    })

    const [selectedCotizaciones, setSelectedCotizaciones] = useState(null);

    return (
        <VentaMostradorContext.Provider
            value={{
                arreglosVenta,
                setArreglosVenta,
                selectedCotizaciones,
                setSelectedCotizaciones
            }}
        >
            {children}
        </VentaMostradorContext.Provider>
    )
}