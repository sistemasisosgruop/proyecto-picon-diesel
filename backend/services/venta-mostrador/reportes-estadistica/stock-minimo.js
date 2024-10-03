import prisma from "../../../prisma";

export class StockMinimoService {

    static async create (data) {
        const { empresaId, ...props } = data;
        const newReporteMargenVenta = await prisma.margenVenta.create ({
            data: {
                ...props,
                empresaId: Number(empresaId)

            }
        })
        return newReporteMargenVenta;
    }

    static async delete (id) {

    }

    static async getAll () {

    }

    static async getAllByParams (params) {

    }
}