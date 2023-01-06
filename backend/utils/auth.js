import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";

const CRIPTO_KEY = process.env.CRIPTO_KEY;

export async function encryptPassword(password) {
  const saltRound = Number(process.env.SALT_ROUNDS) || 10;
  const salt = await bcrypt.genSalt(saltRound);
  return bcrypt.hash(password, salt);
}

export async function matchPassword(password, savedPassword) {
  return bcrypt.compare(password, savedPassword);
}

export function encrypt(text) {
  const ciphertext = CryptoJS.AES.encrypt(text, CRIPTO_KEY).toString();

  return ciphertext;
}

export function decrypt(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, CRIPTO_KEY);

  return bytes.toString(CryptoJS.enc.Utf8);
}
