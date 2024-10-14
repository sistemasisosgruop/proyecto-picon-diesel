import { AuthService } from '../../../../../../backend/services/auth/auth.service';
import { MarcaService } from '../../../../../../backend/services/mantenimiento/maestro-de-codigos/marca.service';

export default async function handler(req, res) {
  try {
    const user = await AuthService.ValidateAccessToken(req, res);
    user && AuthService.AdministradorFeatures(user.roles);

    if (req.method === 'POST') {
      const result = await MarcaService.createMarca(req.body);
      return res.status(200).json(result);
    }

    if (req.method === 'GET') {
      const empresaId = Number(req.query.empresaId);
      const result = await MarcaService.getMarcas(empresaId);
      return res.status(200).json({ data: result });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.message, code: error?.code, fields: error?.meta?.target ?? [] });
  }
}
