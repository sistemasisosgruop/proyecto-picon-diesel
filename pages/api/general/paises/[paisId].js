import { PaisesService } from "../../../../backend/services/general/paises.service";

export default async function handler(req, res) {
  try {
    const paisId = Number(req.query.paisId);
    if (req.method === "PUT") {
      const country = await PaisesService.updateCountry(paisId, req.body);
      return res.status(200).json({ pais: country });
    }

    if (req.method === "DELETE") {
      const country = await PaisesService.deleteCountry(paisId);
      return res.status(200).json({ pais: country });
    }
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: error.meta.cause });
    }
    return res.status(400).json({ error: error.message });
  }
}
