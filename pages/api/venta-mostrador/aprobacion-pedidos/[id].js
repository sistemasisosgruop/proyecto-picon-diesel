import { AuthService } from "../../../../backend/services/auth/auth.service";
import { AprobacionPedidoService } from "../../../../backend/services/venta-mostrador/aprobacion-pedidos.service";

export default async function handler(req, res) {
    try {
        const user = await AuthService.ValidateAccessToken(req,res);
        user && AuthService.AdministradorAndVendedorFeatures(user.roles);

        const id = Number(req.query.id);
        
        if(req.method === "PUT") {
            const result = await AprobacionPedidoService.update(id, req.body);
            return res.status(200).json(result);
        }

        if(req.method === "DELETE") {
            const result = await AprobacionPedidoService.delete(id);
            return res.status(200).json(result);
        }

        if(req.method === "GET") {
            const result = await AprobacionPedidoService.get(id);
            return res.status(200).json(result);
        }

    } catch (error) {
        return res.status(400).json( {error: error.message, code: error?.code});
    }
}