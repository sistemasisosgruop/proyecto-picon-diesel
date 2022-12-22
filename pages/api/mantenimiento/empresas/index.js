import { AuthService } from "../../../../backend/services/auth/auth.service";
import { EmpresasService } from "../../../../backend/services/mantenimiento/empresas.service";

export default async function handler(req, res) {
  try {
    const user = await AuthService.ValidateAccessToken(req, res);
    user && AuthService.AdministradorFeatures(user.roles);

    if (req.method === "POST") {
      const empresa = await EmpresasService.createEmpresa(req.body);
      return res.status(200).json(empresa);
    }

    if (req.method === "GET") {
      const empresas = await EmpresasService.getAllEmpresas(req.body);
      return res.status(200).json({ data: empresas });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
