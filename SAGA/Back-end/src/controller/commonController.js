import prisma from '../util/prisma.js'


export class commonController {
    async info(req, res) {
        const id_user = req.params.id_user;

        try {
            const info = await prisma.user.findUnique({
                where: { id: id_user },
                select: {
                    id: true,
                    matricula: true,
                    nome: true,
                    email: true,
                    dt_nasc: true,
                    telefone: true,
                    cpf: true,
                    ft_perfil: true,
                    tipo: true,
                }
            })

            if (!info) {
                return res.status(404).json({ message: 'Usuário não encontrado' })
            }

            return res.status(200).json(info)
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar informações', error: error.message })
        }
    }
}
