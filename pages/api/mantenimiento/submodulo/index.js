import { SubmoduloService } from '../../../../backend/services/mantenimiento/submodulo.service.js';
import { AuthService } from '../../../../backend/services/auth/auth.service.js';

export default async function handler(req, res) {
  try {
    const user = await AuthService.ValidateAccessToken(req, res);
    user && AuthService.AdministradorFeatures(user.roles);

    if (req.method === 'POST') {
      const result = await SubmoduloService.createSubmodulo(req.body);
      return res.status(200).json(result);
    }

    if (req.method === 'GET') {
      const moduloId = Number(req.query.moduloId);
      const result = await SubmoduloService.getSubmodulos({ moduloId });
      return res.status(200).json({ data: result });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.message, code: error?.code, fields: error?.meta?.target ?? [] });
  }
}
