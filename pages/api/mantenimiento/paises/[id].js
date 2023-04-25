import { ParametrosGlobalesService } from "../../../../backend/services/mantenimiento/parametros-globales.service";
import { AuthService } from "../../../../backend/services/auth/auth.service";

export default async function handler(req, res) {
  try {
    const user = await AuthService.ValidateAccessToken(req, res);
    user && AuthService.AdministradorFeatures(user.roles);

    const id = Number(req.query.id);
    console.log(id)
    if (req.method === "PUT") {
      const result = await ParametrosGlobalesService.updateCountry(id, req.body);
      return res.status(200).json(result);
    }

    if (req.method === "DELETE") {
      const result = await ParametrosGlobalesService.deleteCountry(id);
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(400).json({ error: error.message, code: error?.code });
  }
}
