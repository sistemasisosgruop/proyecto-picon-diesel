import { EmpresasService } from "../../../../backend/services/mantenimiento/empresas.service";

export default async function handler(req, res) {
  try {
    const empresaId = Number(req.query.empresaId);
    if (req.method === "PUT") {
      const empresa = await EmpresasService.updateEmpresa(empresaId, req.body);
      return res.status(200).json(empresa);
    }

    if (req.method === "DELETE") {
      const empresa = await EmpresasService.deleteEmpresa(empresaId);
      return res.status(200).json(empresa);
    }
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: error.meta.cause });
    }
    return res.status(400).json({ error: error.message });
  }
}
