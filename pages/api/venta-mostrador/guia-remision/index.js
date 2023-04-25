import { AuthService } from "../../../../backend/services/auth/auth.service";
import { GuiaRemisionService } from "../../../../backend/services/venta-mostrador/guia-remision.service";


export default async function handler(req, res) {
    try {
        const user = await AuthService.ValidateAccessToken(req, res);
        user && AuthService.AdministradorAndVendedorFeatures(user.roles);        

        if( req.method === 'POST') {
            const result = await GuiaRemisionService.create(req.body);
            return res.status(200).json(result);
        }
        if(req.method === 'GET') {
            const empresaId = Number(req.query.empresaId);
            const filterName = req.query.filterName;
            const result = await GuiaRemisionService.getAll(empresaId, filterName);
            return res.status(200).json( {data: result});
        }

    } catch (error) {
        return res.status(400).json({ error: error.message, code: error?.code, fields: error?.meta?.target ?? [] });
    }
}