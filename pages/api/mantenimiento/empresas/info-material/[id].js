import { AuthService } from "../../../../../backend/services/auth/auth.service";
import { EmpresasService } from "../../../../../backend/services/mantenimiento/empresas.service";

export default async function handler(req, res) {
  try {
    const user = await AuthService.ValidateAccessToken(req, res);
    user && AuthService.AdministradorFeatures(user.roles);

    if (req.method === "GET") {
      const id = Number(req.query.id);
      const result = await EmpresasService.getInfoForMaterial(id);
      return res.status(200).json({ data: result });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
