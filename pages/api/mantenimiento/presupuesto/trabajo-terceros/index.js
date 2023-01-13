import { AuthService } from "../../../../../backend/services/auth/auth.service";
import { TrabajoTercerosService } from "../../../../../backend/services/mantenimiento/trabajo-terceros.service";

export default async function handler(req, res) {
  try {
    const user = await AuthService.ValidateAccessToken(req, res);
    user && AuthService.AdministradorFeatures(user.roles);

    if (req.method === "POST") {
      const result = await TrabajoTercerosService.create(req.body);
      return res.status(200).json(result);
    }

    if (req.method === "GET") {
      const empresaId = Number(req.query.empresaId);
      const result = await TrabajoTercerosService.getAll(empresaId);
      return res.status(200).json({ data: result });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
