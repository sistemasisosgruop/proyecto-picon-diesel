import { serialize } from "cookie";
import { AuthService } from "../../../backend/services/auth/auth.service";

export default async function loginHandler(req, res) {
  try {
    const token = await AuthService.login(req.body);

    if (!token) {
      return res.status(401).json({ status: 401, message: "Unautorized" });
    }
    const serialized = serialize("myTokenName", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/",
    });

    res.setHeader("Set-Cookie", serialized);

    return res.status(200).json({ token });
  } catch (error) {
    console.log(error)
    return res.status(401).json({ status: 401, message: "Unautorized" });
  }
}
