import { AuthService } from "../../../../../../backend/services/auth/auth.service";
import { MaquinaService } from "../../../../../../backend/services/mantenimiento/maestro-de-codigos/maquinas.service";

export default async function handler(req, res) {
  try {
    const user = await AuthService.ValidateAccessToken(req, res);
    user && AuthService.AdministradorFeatures(user.roles);

    const id = Number(req.query.id);
    if (req.method === "GET") {
      const result = await MaquinaService.getMaquina(id);
      return res.status(200).json(result);
    }

    if (req.method === "PUT") {
      const result = await MaquinaService.updateMaquina(id, req.body);
      return res.status(200).json(result);
    }

    if (req.method === "DELETE") {
      const result = await MaquinaService.deleteMaquina(id);
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(400).json({ error: error.message, code: error?.code });
  }
}
