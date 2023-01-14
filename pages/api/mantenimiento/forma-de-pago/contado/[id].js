import { AuthService } from "../../../../../backend/services/auth/auth.service";
import { PagoContadoService } from "../../../../../backend/services/mantenimiento/pago-contado.service";

export default async function handler(req, res) {
  try {
    const user = await AuthService.ValidateAccessToken(req, res);
    user && AuthService.AdministradorFeatures(user.roles);

    const id = Number(req.query.id);
    if (req.method === "PUT") {
      const result = await PagoContadoService.update(id, req.body);
      return res.status(200).json(result);
    }

    if (req.method === "DELETE") {
      const result = await PagoContadoService.delete(id);
      return res.status(200).json(result);
    }
  } catch (error) {
    
    return res.status(400).json({ error: error.message, code: error?.code });
  }
}
