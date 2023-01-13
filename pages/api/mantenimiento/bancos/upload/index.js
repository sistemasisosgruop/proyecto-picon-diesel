import { Formidable } from "formidable";
import csv from "csvtojson";
import prisma from "../../../../../backend/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = (req) => {
  const form = new Formidable();
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  try {
    const empresaId = Number(req.query.empresaId);
    if (req.method === "POST") {
      const data = await readFile(req);
      const csvData = await csv().fromFile(data.files.file.filepath);
      let count = 0;

      await Promise.all(
        csvData.map(async ({ ...info }) => {
          await prisma.banco
            .create({
              data: {
                empresaId,
                ...info,
              },
            })
            .then(() => count++)
            .catch(() => {
              console.error(`Fallo al crear ${JSON.stringify(info)}`);
            });
        })
      );
      console.log(`Sincronizacion de datos terminada, registros creados: ${count}`);

      res.status(200).json({ message: "data sincronizada exitosamente" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
