import { AuthService } from "../../../../../backend/services/auth/auth.service";
import { FamiliaService } from "../../../../../backend/services/mantenimiento/maestro-de-codigos/familias.service";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const result = await FamiliaService.getFamilia(req.query.id);
      return res.status(200).json(result);
    }
    
    const user = await AuthService.ValidateAccessToken(req, res);
    user && AuthService.AdministradorFeatures(user.roles);
    const id = Number(req.query.id);

    if (req.method === "PUT") {
      const result = await FamiliaService.updateFamilia(id, req.body);
      return res.status(200).json(result);
    }
    if (req.method === "DELETE") {
      const result = await FamiliaService.deleteFamilia(id);
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(400).json({ error: error.message, code: error?.code });
  }
}
