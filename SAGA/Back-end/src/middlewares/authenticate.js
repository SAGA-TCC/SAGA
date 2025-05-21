// Exemplo de como deve ser a função tokenAuthenticate:
import jwt from 'jsonwebtoken';

export function tokenAuthenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

<<<<<<< HEAD
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
      console.error("Erro na verificação do token:", error.name, error.message);
      return res.status(401).json({ error: "Token inválido ou expirado", detalhes: error.message });
    }

    console.log("Token válido para o usuário ID:", decoded.userId);
    req.userId = decoded.userId;
    next();
});

};
=======
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Aqui está a correção:
        req.user = {
            id_user: decoded.userId || decoded.id_user // cobre ambos os casos
        };
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido.' });
    }
}
>>>>>>> ff7d94b0dc14e53645e3c9c1327375af4e3a6b4c
