import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';
import prisma from '../../prisma';
import { matchPassword } from '../../utils/auth';

export class AuthService {
  static async login(body) {
    const { email, password } = body;
    const adminUser = await prisma.personal.findUnique({
      where: {
        email,
      },
      include: {
        empresa: true,
        role: true,
      },
    });

    if (adminUser) {
      const passwordMatched = await matchPassword(password, adminUser.password);
      if (passwordMatched) {
        const token = jwt.sign(
          {
            exp: Math.floor(DateTime.now().plus({ months: 6 }).toSeconds()),
            username: adminUser.email,
            id: adminUser.id,
            name: adminUser.nombre,
            empresas: adminUser.empresa.map(({ id, nombre }) => ({
              id,
              nombre,
            })),
            roles: adminUser.role.map((role) => role.name),
          },
          process.env.JWT_SECRET || 'secret',
          { algorithm: 'HS256' }
        );

        return token;
      }
    }

    const vendedor = await prisma.vendedor.findUnique({
      where: {
        email,
      },
      include: {
        empresa: true,
        role: true,
      },
    });

    if (vendedor) {
      const passwordMatched = await matchPassword(password, vendedor.password);

      if (passwordMatched) {
        const token = jwt.sign(
          {
            exp: Math.floor(DateTime.now().plus({ months: 6 }).toSeconds()),
            username: vendedor.email,
            id: vendedor.id,
            name: vendedor.nombre,
            empresas: [{ id: vendedor.empresa.id, name: vendedor.empresa.nombre }],
            roles: vendedor.role.map((role) => role.name),
          },
          process.env.JWT_SECRET || 'secret',
          { algorithm: 'HS256' }
        );

        return token;
      }
    }

    return null;
  }

  static async ValidateAccessToken(req, res) {
    try {
      const [bearerToken] = req.rawHeaders.filter((header) => header.includes('Bearer'));
      const token = bearerToken.split(' ')[1];

      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET || 'secret')
      );

      return payload;
    } catch (error) {
      res.status(401).json({ message: 'unauthorized' });
    }
  }

  static async validarPermiso(correo, method, url) {
    // Asume que el email del usuario está en la sesión
    let accion = '';
    const crud = {
      POST: 'crear',
      PUT: 'actualizar',
      GET: 'leer',
      DELETE: 'eliminar',
    };
    accion = crud[method];
    const personal = await prisma.personal.findUnique({
      where: { email: correo },
      include: {
        puesto: {
          include: {
            permisos: {
              include: {
                submodulo: {
                  select: {
                    nombre: true,
                    modulo: {
                      select: {
                        nombre: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    console.log(method, url.split('/'), 'PARAMS');
    const modulo = url.split('/')[2];
    const submodulo = url.split('/')[3];
    const permisos = personal.puesto.permisos.map((permiso) => permiso);
    const findSubmodulo = permisos.find(
      (permiso) =>
        permiso.submodulo.nombre === submodulo.toUpperCase() &&
        permiso.submodulo.modulo.nombre === modulo.toUpperCase()
    );

    console.log(permisos);
    console.log(findSubmodulo);
    console.log(accion, 'ACCION');
    console.log(method, 'METHOD');
    if (!findSubmodulo || !findSubmodulo[accion]) {
      throw new Error('No tiene permisos para esta acción.');
    }
    // const validarAccion = crud.find(c=> c.POST)
  }

  static AdministradorFeatures(roles) {
    if (typeof roles === 'object') {
      roles = Object.values(roles);
    }
    const containRole = roles.includes('Administrador');

    if (!containRole) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized, solo administradores' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      });
    }
  }

  static AdministradorAndVendedorFeatures(roles) {
    if (typeof roles === 'object') {
      roles = Object.values(roles);
    }
    const containRole = roles.includes('Administrador') || roles.includes('Vendedor');
    if (!containRole) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized, solo administradores o vendedores' }),
        {
          status: 401,
          headers: { 'content-type': 'application/json' },
        }
      );
    }
  }

  // static async validarToken(token) {
  //   const { payload } = await jwtVerify(
  //     token,
  //     new TextEncoder().encode(process.env.JWT_SECRET || 'secret')
  //   );

  //   return payload;
  // }

  static validateRoleTecnico(roles) {
    const containRole = roles.includes('Tecnico');

    if (!containRole) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      });
    }
  }
}