
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../../server.js"

export const tokenAuthenticate = (req, res, next) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token de autenticação não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token inválido" });
  }

  jwt.verify(token, JWT_SECRET, (error, decoded) => {
    if (error) {
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }

    console.log("Payload decodificado do token:", decoded); // deve mostrar { userId: "...", iat: ..., exp: ... }

    req.user = {
        id_user: decoded.userId
    };

    next();
});

};
