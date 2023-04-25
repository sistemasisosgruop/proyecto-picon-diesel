import { AuthService } from "../../../../../../backend/services/auth/auth.service";
import { DescripcionInyectorService } from "../../../../../../backend/services/mantenimiento/maestro-de-codigos/descripcion-inyector.service";

export default async function handler(req, res) {
  try {
    const user = await AuthService.ValidateAccessToken(req, res);
    user && AuthService.AdministradorFeatures(user.roles);

    const id = Number(req.query.id);
    if (req.method === "PUT") {
      const result = await DescripcionInyectorService.updateDescripcionInyector(
        id,
        req.body
      );
      return res.status(200).json(result);
    }

    if (req.method === "DELETE") {
      const result = await DescripcionInyectorService.deleteDescripcionInyector(
        id
      );
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(400).json({ error: error.message, code: error?.code });
  }
}
