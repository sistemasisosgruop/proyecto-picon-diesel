import { PaisesService } from "../../../../backend/services/general/paises.service";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const country = await PaisesService.createCountry(req.body);
    return res.status(200).json({ pais: country });
  }

  if (req.method === "GET") {
    const countries = await PaisesService.getAllCountries();
    return res.status(200).json({ paises: countries });
  }
}
