import { ParametrosGlobalesService } from "../../../../backend/services/mantenimiento/parametros-globales.service";

export default async function handler(req, res) {
  try {
    const parametroId = Number(req.query.parametroId);
    if (req.method === "PUT") {
      const parametro = await ParametrosGlobalesService.updateGlobalParam(
        parametroId,
        req.body
      );
      return res.status(200).json(parametro);
    }

    if (req.method === "DELETE") {
      const parametro = await ParametrosGlobalesService.deleteGlobalParam(
        parametroId
      );
      return res.status(200).json(parametro);
    }
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: error.meta.cause });
    }
    return res.status(400).json({ error: error.message });
  }
}
