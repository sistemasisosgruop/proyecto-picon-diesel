import { EmpresasService } from "../../../../backend/services/mantenimiento/empresas.service";
import { AuthService } from "../../../../backend/services/auth/auth.service";

export default async function handler(req, res) {
  try {
    const user = await AuthService.ValidateAccessToken(req, res);
    user && AuthService.AdministradorFeatures(user.roles);

    const id = Number(req.query.id);
    if (req.method === "GET") {
      const result = await EmpresasService.getEmpresa(id);
      return res.status(200).json(result);
    }

    if (req.method === "PUT") {
      const result = await EmpresasService.updateEmpresa(id, req.body);
      return res.status(200).json(result);
    }

    if (req.method === "DELETE") {
      const result = await EmpresasService.deleteEmpresa(id);
      return res.status(200).json(result);
    }
  } catch (error) {
    
    return res.status(400).json({ error: error.message, code: error?.code });
  }
}
