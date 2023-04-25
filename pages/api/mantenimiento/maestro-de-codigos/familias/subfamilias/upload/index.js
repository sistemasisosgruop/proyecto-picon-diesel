import { Formidable } from "formidable";
import csv from "csvtojson";
import prisma from "../../../../../../../backend/prisma";

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
    const familia = req.query.familia;
    if (req.method === "POST") {
      const data = await readFile(req);

      const csvData = await csv().fromFile(data.files.file.filepath);

      await Promise.all(
        csvData.map(async ({ ...info }) => {
          try {
            const newRegister = await prisma.familia.create({
              data: {
                familia: {
                  connect: {
                    codigo: familia,
                  },
                },
                ...info,
              },
            });
            console.log(`Nuevo registro creado con id: ${newRegister.id}`);
          } catch (error) {
            console.error(`Fallo al crear ${JSON.stringify(info)} ${error.message}`);
          }
        })
      );

      res.status(200).json({ message: "data sincronizada exitosamente" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
