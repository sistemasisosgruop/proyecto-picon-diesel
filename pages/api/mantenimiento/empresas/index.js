import { EmpresasService } from "../../../../backend/services/mantenimiento/empresas.service";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const empresa = await EmpresasService.createEmpresa(req.body);
    return res.status(200).json(empresa);
  }

  if (req.method === "GET") {
    const empresas = await EmpresasService.getAllEmpresas(req.body);
    return res.status(200).json({ data: empresas });
  }
}
