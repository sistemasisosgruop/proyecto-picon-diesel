import { ParametrosGlobalesService } from "../../../../backend/services/mantenimiento/parametros-globales.service";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const pais = await ParametrosGlobalesService.createCountry(req.body);
    return res.status(200).json(pais);
  }

  if (req.method === "GET") {
    const countries = await ParametrosGlobalesService.getAllCountries(req.body);
    return res.status(200).json({ data: countries });
  }
}
