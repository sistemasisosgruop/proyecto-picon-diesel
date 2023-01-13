import { AuthService } from "../../../../backend/services/auth/auth.service";
import { EmpresasService } from "../../../../backend/services/mantenimiento/empresas.service";

export default async function handler(req, res) {
  try {

    const user = await AuthService.ValidateAccessToken(req, res);
    user && AuthService.AdministradorFeatures(user.roles);

    if (req.method === "POST") {
      const result = await EmpresasService.createEmpresa(req.body);
      return res.status(200).json(result);
    }

    if (req.method === "GET") {
      const adminId = Number(req.query.adminId);
      const result = await EmpresasService.getAllEmpresas(adminId);
      return res.status(200).json({ data: result });
    }
  } catch (error) {

    return res.status(400).json({ error: error.message });
  }
}
