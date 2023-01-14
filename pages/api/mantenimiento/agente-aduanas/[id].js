import { AuthService } from "../../../../backend/services/auth/auth.service";
import { AgenteAduanasService } from "../../../../backend/services/mantenimiento/agente-aduanas.service";


export default async function handler(req, res) {
  try {
    const user = await AuthService.ValidateAccessToken(req, res);
    user && AuthService.AdministradorFeatures(user.roles);

    const id = Number(req.query.id);
    if (req.method === "PUT") {
      const result = await AgenteAduanasService.updateAgenteAduanas(id, req.body);
      return res.status(200).json(result);
    }

    if (req.method === "DELETE") {
      const result = await AgenteAduanasService.deleteAgenteAduanas(id);
      return res.status(200).json(result);
    }
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: error.meta.cause });
    }
    return res.status(400).json({ error: error.message, code: error?.code });
  }
}
