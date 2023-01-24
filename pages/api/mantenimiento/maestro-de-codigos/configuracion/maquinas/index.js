import { AuthService } from "../../../../../../backend/services/auth/auth.service";
import { MaquinaService } from "../../../../../../backend/services/mantenimiento/maestro-de-codigos/maquinas.service";

export default async function handler(req, res) {
  try {
    const user = await AuthService.ValidateAccessToken(req, res);
    user && AuthService.AdministradorFeatures(user.roles);

    if (req.method === "POST") {
      const result = await MaquinaService.createMaquina(req.body);
      return res.status(200).json(result);
    }

    if (req.method === "GET") {
      const empresaId = Number(req.query.empresaId);
      const filterName = req.query.filter;
      const result = await MaquinaService.getMaquinas(empresaId, filterName);
      return res.status(200).json({ data: result });
    }
  } catch (error) {

    return res
    .status(400)
    .json({ error: error.message, code: error?.code, fields: error?.meta?.target ?? [] });
  }
}
