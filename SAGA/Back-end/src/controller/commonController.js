import prisma from '../util/prisma.js'


export class commonController {
    async info(req, res) {
        const id_user = req.params.id_user;
        console.log(`Buscando informações para o usuário ID: ${id_user}`);

        try {
            // Verificar se o ID é válido
            if (!id_user || typeof id_user !== 'string') {
                console.error(`ID de usuário inválido: ${id_user}`);
                return res.status(400).json({ message: 'ID de usuário inválido' });
            }

            // Buscar o usuário no banco
            console.log(`Consultando usuário no banco de dados: ${id_user}`);
            const info = await prisma.user.findUnique({
                where: { id_user: id_user },
                select: {
                    id_user: true,
                    matricula: true,
                    nome: true,
                    email: true,
                    dt_nasc: true,
                    telefone: true,
                    cpf: true,
                    ft_perfil: true,
                    tipo: true,
                }
            });

            console.log(`Resultado da consulta:`, info);

            if (!info) {
                console.log(`Usuário não encontrado: ${id_user}`);
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            // Realizar sanitização dos dados para evitar problemas no front
            const sanitizedInfo = {
                id_user: info.id_user || null,
                matricula: info.matricula || null,
                nome: info.nome || '',
                email: info.email || '',
                dt_nasc: info.dt_nasc ? info.dt_nasc.toISOString() : null,
                telefone: info.telefone || '',
                cpf: info.cpf || '',
                ft_perfil: info.ft_perfil || '',
                tipo: info.tipo || 0
            };

            console.log(`Enviando resposta sanitizada:`, sanitizedInfo);
            return res.status(200).json(sanitizedInfo);
        } catch (error) {
            console.error(`Erro ao buscar informações: ${error.message}`, error);
            return res.status(500).json({ 
                message: 'Erro ao buscar informações', 
                error: error.message,
                stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
            });
        }
    }

    async editarInfo(req, res) {
        const { id_user, nome, email, dt_nasc, telefone, ft_perfil } = req.body;
        
        console.log('Solicitação de atualização recebida:', { id_user, nome, email, dt_nasc, telefone });
        
        try {
            // Validação dos dados recebidos
            if (!id_user) {
                return res.status(400).json({ message: 'ID do usuário é obrigatório' });
            }

            // Verificar se o usuário existe
            const userExists = await prisma.user.findUnique({
                where: { id_user }
            });

            if (!userExists) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            // Dados para atualização com validação
            const updateData = {};
            
            if (nome !== undefined) updateData.nome = nome;
            if (email !== undefined) updateData.email = email;
            
            // Tratamento especial para a data
            if (dt_nasc) {
                try {
                    updateData.dt_nasc = new Date(dt_nasc);
                    if (isNaN(updateData.dt_nasc.getTime())) {
                        return res.status(400).json({ message: 'Data de nascimento inválida' });
                    }
                } catch (error) {
                    return res.status(400).json({ message: 'Data de nascimento em formato inválido' });
                }
            }
            
            // Tratamento para telefone
            if (telefone !== undefined) {
                updateData.telefone = telefone;
                
                // Verificar se o telefone já existe para outro usuário
                const existingUserWithPhone = await prisma.user.findFirst({
                    where: {
                        telefone: telefone,
                        id_user: { not: id_user }
                    }
                });
                
                if (existingUserWithPhone) {
                    return res.status(400).json({ message: 'Este número de telefone já está em uso por outro usuário' });
                }
            }
            
            // Atualizar a foto de perfil se fornecida
            if (ft_perfil !== undefined) {
                updateData.ft_perfil = ft_perfil;
            }

            console.log('Dados para atualização:', updateData);

            // Atualizar o usuário
            const updatedUser = await prisma.user.update({
                where: { id_user },
                data: updateData
            });

            console.log('Usuário atualizado com sucesso:', updatedUser.id_user);

            // Sanitizar a resposta
            const sanitizedUser = {
                id_user: updatedUser.id_user,
                nome: updatedUser.nome,
                email: updatedUser.email,
                dt_nasc: updatedUser.dt_nasc ? updatedUser.dt_nasc.toISOString() : null,
                telefone: updatedUser.telefone,
                tipo: updatedUser.tipo
            };

            return res.status(200).json({
                message: 'Informações atualizadas com sucesso',
                user: sanitizedUser
            });
        } catch (error) {
            console.error('Erro ao atualizar informações:', error);
            
            // Tratamento específico para erros conhecidos
            if (error.code === 'P2002') {
                return res.status(400).json({ 
                    message: 'Erro de restrição única', 
                    error: 'Já existe um usuário com este e-mail ou telefone'
                });
            }
            
            return res.status(500).json({ 
                message: 'Erro ao atualizar informações', 
                error: error.message,
                stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
            });
        }
    }
}
