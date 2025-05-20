
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../../server.js"

export const tokenAuthenticate = (req, res, next) => {
  console.log("Verificando autenticação do token...");
  console.log("URL requisitada:", req.originalUrl);
  const authHeader = req.headers?.authorization;

  if (!authHeader) {
    console.error("Token não fornecido no cabeçalho de autorização");
    return res.status(401).json({ error: "Token de autenticação não fornecido" });
  }

  console.log("Cabeçalho de autenticação:", authHeader);
  const token = authHeader.split(" ")[1];

  if (!token) {
    console.error("Token não encontrado após separação do cabeçalho");
    return res.status(401).json({ error: "Token inválido" });
  }

  console.log("Token extraído:", token.substring(0, 10) + "...");
  console.log("Verificando validade do token com JWT_SECRET:", JWT_SECRET ? "Definido" : "Indefinido");

  jwt.verify(token, JWT_SECRET, (error, decoded) => {
    if (error) {
<<<<<<< HEAD
      console.error("Erro na verificação do token:", error.name, error.message);
      return res.status(401).json({ error: "Token inválido ou expirado", detalhes: error.message });
    }

    console.log("Token válido para o usuário ID:", decoded.userId);
    req.userId = decoded.userId;
=======
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }

    console.log("Payload decodificado do token:", decoded); // deve mostrar { userId: "...", iat: ..., exp: ... }

    req.user = {
        id_user: decoded.userId
    };

>>>>>>> 2b3dff954379317e565f7a902e35d208910531f0
    next();
});

};
