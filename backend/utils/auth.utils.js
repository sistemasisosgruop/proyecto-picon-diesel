import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function decodePayload(req, res) {
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

export function validateRoleAdministrativo(roles) {
  const containRole = roles.includes("Administrador");

  if (!containRole) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
}

export function validateRoleGlobal(roles) {
  const containRole = roles.includes("Global");

  if (!containRole) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
}
