import bcrypt from "bcrypt";

export async function encryptPassword(password) {
  const saltRound = Number(process.env.SALT_ROUNDS) || 10;
  const salt = await bcrypt.genSalt(saltRound);
  return bcrypt.hash(password, salt);
}

export async function matchPassword(password, savedPassword) {
  return bcrypt.compare(password, savedPassword);
}
