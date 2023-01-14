import { AuthService } from "../../../../../../backend/services/auth/auth.service";
import { PresupuestoSubFamiliaService } from "../../../../../../backend/services/mantenimiento/presupuesto-subfamilia.service";

export default async function handler(req, res) {
  try {
    const user = await AuthService.ValidateAccessToken(req, res);
    user && AuthService.AdministradorFeatures(user.roles);

    if (req.method === "POST") {
      const result = await PresupuestoSubFamiliaService.create(req.body);
      return res.status(200).json(result);
    }

    if (req.method === "GET") {
      const familiaId = Number(req.query.familiaId);
      const result = await PresupuestoSubFamiliaService.getAll(familiaId);
      return res.status(200).json({ data: result });
    }
  } catch (error) {

    return res
    .status(400)
    .json({ error: error.message, code: error?.code, fields: error?.meta?.target ?? [] });
  }
}
