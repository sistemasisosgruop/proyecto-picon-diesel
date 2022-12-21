import { ParametrosGlobalesService } from "../../../../backend/services/mantenimiento/parametros-globales.service";

export default async function handler(req, res) {
  try {
    const paisId = Number(req.query.paisId);
    if (req.method === "PUT") {
      const pais = await ParametrosGlobalesService.updateCountry(
        paisId,
        req.body
      );
      return res.status(200).json(pais);
    }

    if (req.method === "DELETE") {
      const pais = await ParametrosGlobalesService.deleteCountry(paisId);
      return res.status(200).json(pais);
    }
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: error.meta.cause });
    }
    return res.status(400).json({ error: error.message });
  }
}
