import { AuthService } from "../../../../../backend/services/auth/auth.service";
import { PresupuestoFamiliaService } from "../../../../../backend/services/mantenimiento/presupuesto/presupuesto-familia.service";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const result = await PresupuestoFamiliaService.get(req.query.id);
      return res.status(200).json(result);
    }

    const user = await AuthService.ValidateAccessToken(req, res);
    user && AuthService.AdministradorFeatures(user.roles);
    const id = Number(req.query.id);

    if (req.method === "PUT") {
      const result = await PresupuestoFamiliaService.update(id, req.body);
      return res.status(200).json(result);
    }
    if (req.method === "DELETE") {
      const result = await PresupuestoFamiliaService.delete(id);
      return res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message, code: error?.code });
  }
}
