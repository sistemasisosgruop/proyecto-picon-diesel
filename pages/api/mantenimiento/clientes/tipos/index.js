import { AuthService } from "../../../../../backend/services/auth/auth.service";
import { ClienteService } from "../../../../../backend/services/mantenimiento/clientes.service";


export default async function handler(req, res) {
  try {

    const user = await AuthService.ValidateAccessToken(req, res);
    user && AuthService.AdministradorFeatures(user.roles);

    if (req.method === "POST") {
      const result = await ClienteService.createTipoCliente(req.body);
      return res.status(200).json(result);
    }

    if (req.method === "GET") {
      const empresaId = Number(req.query.empresaId);
      const result = await ClienteService.getAllTipoCliente(empresaId);
      return res.status(200).json({ data: result });
    }
  } catch (error) {

    return res.status(400).json({ error: error.message });
  }
}
