import { AuthService } from '../../../../../../backend/services/auth/auth.service';
import { MatrialesService } from '../../../../../../backend/services/mantenimiento/maestro-de-codigos/materiales.service';

export default async function handler(req, res) {
  try {
    const user = await AuthService.ValidateAccessToken(req, res);
    user && AuthService.AdministradorFeatures(user.roles);

    if (req.method === 'POST') {
      const result = await MatrialesService.createMaterial(req.body);
      return res.status(200).json(result);
    }

    if (req.method === 'GET') {
      const queryFilter = {
        empresaId: Number(req.query.empresaId),
        filterName: req.query.filter,
        page: Number(req.query.page),
        take: Number(req.query.take),
        nombreInterno: req.query.nombreInterno,
        nombreComercial: req.query.nombreComercial,
        marca: req.query.marca,
        codigoReferencia: req.query.codigoReferencia,
      };
      console.log(queryFilter, 'QUERY FILTER EN CONTROLADOR');
      const result = await MatrialesService.getMateriales(queryFilter);
      return res.status(200).json(result);
    }
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.message, code: error?.code, fields: error?.meta?.target ?? [] });
  }
}
