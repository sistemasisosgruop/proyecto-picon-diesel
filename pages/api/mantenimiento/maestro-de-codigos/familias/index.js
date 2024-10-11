import { AuthService } from "../../../../../backend/services/auth/auth.service";
import { FamiliaService } from "../../../../../backend/services/mantenimiento/maestro-de-codigos/familias.service";

export default async function handler(req, res) {
  try {
    const user = await AuthService.ValidateAccessToken(req, res);
    user && AuthService.AdministradorFeatures(user.roles);
    await AuthService.validarPermiso(user.username, req.method, req.url);

    if (req.method === "POST") {
      const result = await FamiliaService.createFamilia(req.body);
      return res.status(200).json(result);
    }

    if (req.method === "GET") {
      const empresaId = Number(req.query.empresaId);
      const result = await FamiliaService.getFamilias(empresaId);
      return res.status(200).json({ data: result });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.message, code: error?.code, fields: error?.meta?.target ?? [] });
  }
}
