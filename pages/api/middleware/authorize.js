import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { getSession } from 'next-auth/react';

export async function middleware(req, res, next) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'No autenticado.' });
  }

  const personal = await prisma.personal.findUnique({
    where: { correo: session.user.email },
    include: {
      puesto: {
        include: {
          permisos: {
            include: {
              submodulo: true,
            },
          },
        },
      },
    },
  });

  if (!personal) {
    return res.status(403).json({ message: 'Acceso denegado.' });
  }

  const url = req.url;
  const action = req.method.toLowerCase(); // Identifica la acción según el método HTTP

  const submodulo = 'cotizaciones'; // Este valor debería estar basado en tu URL o ruta.
  const permiso = personal.puesto.permisos.find((p) => p.submodulo.nombre === submodulo);

  if (!permiso || !permiso[action]) {
    return res.status(403).json({ message: 'No tienes permisos para realizar esta acción.' });
  }

  next(); // Continúa al siguiente paso si pasa la autorización.
}
