import { AuthService } from "../../../../backend/services/auth/auth.service";
import { CotizacionService } from "../../../../backend/services/venta-mostrador/cotizacion.service";

export default async function handler(req, res) {
    try {
        const user = await AuthService.ValidateAccessToken(req,res);
        user && AuthService.AdministradorAndVendedorFeatures(user.roles);

        const id = Number(req.query.id);
        
        if(req.method === "PUT") {
            const result = await CotizacionService.update(id, req.body);
            return res.status(200).json(result);
        }

        if(req.method === "DELETE") {
            const result = await CotizacionService.delete(id);
            return res.status(200).json(result);
        }

        if(req.method === "GET") {
            const result = await CotizacionService.get(id);
            return res.status(200).json(result);
        }

    } catch (error) {
        return res.status(400).json( {error: error.message, code: error?.code});
    }
}