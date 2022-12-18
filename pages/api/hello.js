// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {
  decodePayload,
  validateRoleGlobal,
  validateRoleAdministrativo,
} from "../../backend/utils/auth.utils";

export default async function handler(req, res) {
  try {
    const user = await decodePayload(req, res);
    const isAdministrativo = validateRoleAdministrativo(user.roles);
    const isGlobal = validateRoleGlobal(user.roles);
    console.log(user, isAdministrativo, isGlobal);
    res.status(200).json({ user, isAdministrativo, isGlobal });
  } catch (error) {
    res.status(400).json({ message: error?.message });
  }
}
