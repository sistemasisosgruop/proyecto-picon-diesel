import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { DateTime } from "luxon";
import prisma from "../../prisma";
import { matchPassword } from "../../utils/auth";

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
          process.env.JWT_SECRET || "secret",
          { algorithm: "HS256" }
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
            empresas: [
              { id: vendedor.empresa.id, name: vendedor.empresa.nombre },
            ],
            roles: vendedor.role.map((role) => role.name),
          },
          process.env.JWT_SECRET || "secret",
          { algorithm: "HS256" }
        );

        return token;
      }
    }

    return null;
  }

  static async ValidateAccessToken(req, res) {
    try {
      const [bearerToken] = req.rawHeaders.filter((header) =>
        header.includes("Bearer")
      );
      const token = bearerToken.split(" ")[1];

      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET || "secret")
      );

      return payload;
    } catch (error) {
      res.status(401).json({ message: "unauthorized" });
    }
  }

  static AdministradorFeatures(roles) {
    if (typeof roles === 'object') {
      roles = Object.values(roles);
    }
    const containRole = roles.includes("Administrador");

    if (!containRole) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized, solo administradores" }),
        {
          status: 401,
          headers: { "content-type": "application/json" },
        }
      );
    }
  }

  static AdministradorAndVendedorFeatures(roles) {
    if (typeof roles === 'object') {
      roles = Object.values(roles);
    }
    const containRole = roles.includes("Administrador") || roles.includes("Vendedor");
    if(!containRole) {
      return new NextResponse(
        JSON.stringify({message: "Unauthorized, solo administradores o vendedores"}),
        {
          status: 401,
          headers: {"content-type": "application/json"},
        }
      )
    }
  }

  static validateRoleTecnico(roles) {
    const containRole = roles.includes("Tecnico");

    if (!containRole) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }
  }
}
