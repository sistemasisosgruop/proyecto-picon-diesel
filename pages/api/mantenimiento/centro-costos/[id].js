import { AuthService } from "../../../../backend/services/auth/auth.service";
import { CostosService } from "../../../../backend/services/mantenimiento/costos.service";

export default async function handler(req, res) {
  try {
    const user = await AuthService.ValidateAccessToken(req, res);
    user && AuthService.AdministradorFeatures(user.roles);

    const id = Number(req.query.id);
    if (req.method === "PUT") {
      const result = await CostosService.updateCosto(id, req.body);
      return res.status(200).json(result);
    }

    if (req.method === "DELETE") {
      const result = await CostosService.deleteCosto(id);
      return res.status(200).json(result);
    }
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: error.meta.cause });
    }
    return res.status(400).json({ error: error.message });
  }
}
