import { JwtPayload } from "jsonwebtoken";

export interface IDecodedToken extends JwtPayload {
  email: string;
  code: string;
}
