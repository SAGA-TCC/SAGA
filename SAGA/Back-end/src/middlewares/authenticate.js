// import jwt from 'jsonwebtoken'
// import { JWT_SECRET } from "../../server.js"

// export const tokenAuthenticate = (req, res, next ) => {

//     const authHeader = req.headers?.authorization;

//     if (!authHeader) {
//       return res.status(401).json({ error: "Token de autenticação não fornecido" });
//     }
  
//     const token = authHeader.split(" ")[1];


//     if(!responseToken){ return res.json({error: "Token inválido "}) }

//     jwt.verify(responseToken, JWT_SECRET, (error, decoded)=>{
        
//         if(error){ 
//             return res.status(401).json({error: "token invalido ou expirado"}) 
//         }

//         req.userId = decoded.userId

//         next()
//     })
// }


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
      console.error("Erro na verificação do token:", error.name, error.message);
      return res.status(401).json({ error: "Token inválido ou expirado", detalhes: error.message });
    }

    console.log("Token válido para o usuário ID:", decoded.userId);
    req.userId = decoded.userId;
    next();
  });
};
