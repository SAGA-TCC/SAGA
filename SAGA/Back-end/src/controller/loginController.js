import bcrypt from 'bcryptjs';
import prisma from "../util/prisma.js";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../../server.js";

export class LoginController {
    async auth(req, res) {
        const { email, senha } = req.body;

        const userExists = await prisma.user.findUnique({ where: { email } });


        if (!userExists) {
            return res.status(401).json({ error: "Email não encontrado!" });
        }

        const isPasswordValid = await bcrypt.compare(senha, userExists.senha);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Senha incorreta!" });
        }

        console.log("userExists.id:", userExists.id);  // veja o valor aqui!

        const id_user = userExists.id_user; // <-- Corrigido

        const token = jwt.sign(
            { userId: id_user }, // <-- Corrigido
            JWT_SECRET,
            { expiresIn: '1h' }
        );


        const tipo = userExists.tipo;

        console.log("Logado com sucesso!");
        return res.json({ token, tipo, id_user });
    }
}