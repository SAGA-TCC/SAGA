// Exemplo de como deve ser a função tokenAuthenticate:
import jwt from 'jsonwebtoken';

export function tokenAuthenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

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