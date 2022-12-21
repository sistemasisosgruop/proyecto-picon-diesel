import { ParametrosGlobalesService } from "../../../../backend/services/mantenimiento/parametros-globales.service";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const parametro = await ParametrosGlobalesService.createGlobalParam(
      req.body
    );
    return res.status(200).json(parametro);
  }

  if (req.method === "GET") {
    const parametros = await ParametrosGlobalesService.getGlobalParams(
      req.body
    );
    return res.status(200).json({ data: parametros });
  }
}
