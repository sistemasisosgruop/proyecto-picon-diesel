import { PuestoService } from '../../../../backend/services/mantenimiento/puesto.service.js';
import { AuthService } from '../../../../backend/services/auth/auth.service';

export default async function handler(req, res) {
  try {
    const user = await AuthService.ValidateAccessToken(req, res);
    user && AuthService.AdministradorFeatures(user.roles);

    if (req.method === 'POST') {
      console.log('POST PEUSTO');
      const result = await PuestoService.createPuesto(req.body);
      return res.status(200).json(result);
    }

    if (req.method === 'GET') {
      const empresaId = Number(req.query.empresaId);
      const result = await PuestoService.getPuestos({ empresaId });
      return res.status(200).json({ data: result });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.message, code: error?.code, fields: error?.meta?.target ?? [] });
  }
}
