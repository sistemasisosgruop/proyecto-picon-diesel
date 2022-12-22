import { AuthService } from "../../../../backend/services/auth/auth.service";
import { ParametrosGlobalesService } from "../../../../backend/services/mantenimiento/parametros-globales.service";

export default async function handler(req, res) {
  try {
    const user = await AuthService.ValidateAccessToken(req, res);
    user && AuthService.AdministradorFeatures(user.roles);

    if (req.method === "POST") {
      const pais = await ParametrosGlobalesService.createCountry(req.body);
      return res.status(200).json(pais);
    }

    if (req.method === "GET") {
      const countries = await ParametrosGlobalesService.getAllCountries(
        req.body
      );
      return res.status(200).json({ data: countries });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
