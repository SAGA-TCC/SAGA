import prisma from "../util/prisma.js";
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';



export class SecController {

    // => Curso
    async cadCurso(req, res) {
        const { nome, periodo, descricao, ch_total, freq_min } = req.body;
        const curso = await prisma.curso.create({
            data: {
                nome,
                periodo,
                descricao,
                ch_total,
                freq_min
            }
        });
        return res.json(curso);
    }

    async listarCursos(req, res) {
        const cursos = await prisma.curso.findMany({
            include: {
                materias: true
            }
        });
        return res.json(cursos);
    }

    async editarCurso(req, res) {
        const { id_curso } = req.params;
        const { nome, periodo, descricao, ch_total, freq_min } = req.body;
        const curso = await prisma.curso.update({ where: { id_curso }, data: { nome, periodo, descricao, ch_total, freq_min } });
        if (!curso) {
            return res.status(404).json({ message: "Curso não encontrado!" });
        }
        return res.status(204).json(curso);
    }

    async excluirCurso(req, res) {
        const { id_curso } = req.params;
        const curso = await prisma.curso.delete({ where: { id_curso } });
        return res.status(204).json(curso);
    }

    // => Materia
    async cadMateria(req, res) {
        const { id_curso } = req.params;
        const { nome, descricao, ch_total, freq_min } = req.body;
        const materia = await prisma.materia.create({
            data: {
                nome,
                descricao,
                ch_total,
                freq_min,
                id_curso
            }
        });
        return res.json(materia);
    }

    async listarMaterias(req, res) {
        const { id_curso } = req.params;
        const materias = await prisma.materia.findMany({
            where: {
                id_curso
            }
        });
        return res.json(materias);
    }

    async editarMateria(req, res) {
        const { id_materia } = req.params;
        const { nome, descricao, ch_total, freq_min } = req.body;

        const materia = await prisma.materia.update({
            where: { id_materia },
            data: { nome, descricao, ch_total, freq_min }
        });

        if (!materia) {
            return res.status(404).json({ message: "Materia não encontrada!" });
        }
        return res.status(204).json(materia);
    }

    async excluirMateria(req, res) {
        const { id_materia } = req.params;
        const materia = await prisma.materia.delete({ where: { id_materia } });
        return res.status(204).json(materia);
    }


    // => Usuario

    async criarUsuario(req, res) {
        const { nome, email, senha, dt_nasc, telefone, cpf, ft_perfil, tipo } = req.body

        const emailHsh = await prisma.user.findUnique({ where: { email } })

        if (emailHsh) {
            return res.json({ error: "Email já cadastrado" })
        }
        const senhaHash = await bcrypt.hash(senha, 10);

        await prisma.user.create({
            data: {
                nome,
                email,
                senha: senhaHash,
                dt_nasc,
                telefone,
                cpf,
                ft_perfil,
                tipo
            }
        })
        console.log("Cadastro concluido com sucesso")
        return res.json({ message: "Cadastro concluido com sucesso" })

    }

    //cadastrar usuario aluno
    async cadAluno(req, res) {
        const { nome, email, senha, dt_nasc, telefone, cpf, ft_perfil, id_turma } = req.body;
        
        // Verificar email duplicado
        const emailHsh = await prisma.user.findUnique({ where: { email } });
        if (emailHsh) {
            return res.json({ error: "Email já cadastrado" });
        }
        
        // Verificar telefone duplicado
        const telefoneHsh = await prisma.user.findUnique({ where: { telefone } });
        if (telefoneHsh) {
            return res.json({ error: "Telefone já cadastrado" });
        }
        
        // Verificar CPF duplicado
        const cpfHsh = await prisma.user.findUnique({ where: { cpf } });
        if (cpfHsh) {
            return res.json({ error: "CPF já cadastrado" });
        }
        
        const senhaHash = await bcrypt.hash(senha, 10);
        try {
            // Cria o usuário
            const user = await prisma.user.create({
                data: {
                    nome,
                    email,
                    senha: senhaHash,
                    dt_nasc,
                    telefone,
                    cpf,
                    ft_perfil,
                    tipo: 3 // ou o valor inteiro correspondente a aluno
                }
            });

            // Cria o aluno vinculado ao usuário e à turma
            await prisma.aluno.create({
                data: {
                    id_user: user.id_user,
                    id_turma
                }
            });
            
            console.log("Cadastro de aluno concluído com sucesso");
            return res.json({ message: "Cadastro de aluno concluído com sucesso" });
        } catch (error) {
            console.error("Erro ao cadastrar aluno:", error);
            return res.status(500).json({ error: "Erro ao cadastrar aluno", detalhes: error.message });
        }
    }

    //cadastrar usuario professor
    async cadProfessor(req, res) {
        const { nome, email, senha, dt_nasc, telefone, cpf, ft_perfil} = req.body;
        const emailHsh = await prisma.user.findUnique({ where: { email } });
        if (emailHsh) {
            return res.json({ error: "Email já cadastrado" });
        }
        const senhaHash = await bcrypt.hash(senha, 10);
        try {
            // Cria o usuário
            const user = await prisma.user.create({
                data: {
                    nome,
                    email,
                    senha: senhaHash,
                    dt_nasc,
                    telefone,
                    cpf,
                    ft_perfil,
                    tipo: 2 // 2 = Professor
                }
            });

            // Cria o professor vinculado ao usuário
            await prisma.professor.create({
                data: {
                    id_user: user.id_user
                }
            });

            console.log("Cadastro de professor concluído com sucesso");
            return res.json({ message: "Cadastro de professor concluído com sucesso" });
        } catch (error) {
            console.error("Erro ao cadastrar professor:", error);
            return res.status(500).json({ error: "Erro ao cadastrar professor", detalhes: error.message });
        }
    }

    //cadastrar usuario secretaria
    async cadSecretaria(req, res) {
        const { nome, email, senha, dt_nasc, telefone, cpf, ft_perfil } = req.body;
        const emailHsh = await prisma.user.findUnique({ where: { email } });
        if (emailHsh) {
            return res.json({ error: "Email já cadastrado" });
        }
        const senhaHash = await bcrypt.hash(senha, 10);
        try {
            // Cria o usuário
            const user = await prisma.user.create({
                data: {
                    nome,
                    email,
                    senha: senhaHash,
                    dt_nasc,
                    telefone,
                    cpf,
                    ft_perfil,
                    tipo: 1 // 1 = Secretaria
                }
            });
            // Cria a secretaria vinculada ao usuário
            await prisma.secretaria.create({
                data: {
                    id_user: user.id_user
                }
            });
            console.log("Cadastro de secretaria concluído com sucesso");
            return res.json({ message: "Cadastro de secretaria concluído com sucesso" });
        }
        catch (error) {
            console.error("Erro ao cadastrar secretaria:", error);
            return res.status(500).json({ error: "Erro ao cadastrar secretaria", detalhes: error.message });
        }
    }
    

    async listarUsuarios(req, res) {
        try {
            const usuarios = await prisma.user.findMany({
                select: {
                    id_user: true,
                    matricula: true,
                    nome: true,
                    email: true,
                    dt_nasc: true,
                    telefone: true,
                    cpf: true,
                    ft_perfil: true,
                    tipo: true
                }
            });

            return res.status(200).json(usuarios);
        } catch (error) {
            console.error("Erro ao listar usuários:", error);
            return res.status(500).json({
                erro: "Erro ao listar usuários",
                detalhes: error.message
            });
        }
    }

    async editarUsuario(req, res) {
        const { id_user } = req.params;
        const { nome, email, senha, dt_nasc, telefone, cpf, ft_perfil } = req.body;

        try {
            // Verifica se o usuário existe - CORRIGIDO de id para id_user
            const usuarioExistente = await prisma.user.findUnique({
                where: { id_user: id_user }
            });

            if (!usuarioExistente) {
                return res.status(404).json({ erro: "Usuário não encontrado" });
            }

            // Prepara os dados para atualização
            const updateData = {
                nome,
                email,
                dt_nasc: new Date(dt_nasc),
                telefone
            };

            // Adicionar campos opcionais somente se fornecidos
            if (senha) {
                updateData.senha = await bcrypt.hash(senha, 10);
            }
            
            if (cpf) {
                updateData.cpf = cpf;
            }
            
            if (ft_perfil) {
                updateData.ft_perfil = ft_perfil;
            }

            // CORRIGIDO de id para id_user
            const usuario = await prisma.user.update({
                where: { id_user: id_user },
                data: updateData
            });

            return res.json(usuario);
        } catch (error) {
            console.error("Erro ao editar usuário:", error);
            return res.status(500).json({
                erro: "Erro ao editar usuário",
                detalhes: error.message
            });
        }
    }


    async excluirUsuario(req, res) {
        const { id_user } = req.params;

        try {
            // Verificar se o usuário existe
            const usuarioExistente = await prisma.user.findUnique({
                where: { id_user: id_user }
            });

            if (!usuarioExistente) {
                return res.status(404).json({ message: "Usuário não encontrado!" });
            }

            // Excluir registros relacionados com base no tipo de usuário
            if (usuarioExistente.tipo === 3) { // Aluno
                // Encontrar o registro de aluno
                const aluno = await prisma.aluno.findFirst({
                    where: { id_user: id_user }
                });
                
                if (aluno) {
                    // Excluir registros de presença relacionados ao aluno
                    if (prisma.presenca) {
                        await prisma.presenca.deleteMany({
                            where: { id_aluno: aluno.id_aluno }
                        });
                    }
                    
                    // Excluir registros de notas relacionados ao aluno
                    if (prisma.nota) {
                        await prisma.nota.deleteMany({
                            where: { id_aluno: aluno.id_aluno }
                        });
                    }
                    
                    // Excluir registros de frequência relacionados ao aluno
                    if (prisma.frequencia) {
                        await prisma.frequencia.deleteMany({
                            where: { id_aluno: aluno.id_aluno }
                        });
                    }
                    
                    // Excluir o aluno
                    await prisma.aluno.delete({
                        where: { id_aluno: aluno.id_aluno }
                    });
                }
            } else if (usuarioExistente.tipo === 2) { // Professor
                // Restante do código para professor permanece igual
                const professor = await prisma.professor.findFirst({
                    where: { id_user: id_user }
                });
                
                if (professor) {
                    // Se houver modelo professorTurma definido
                    if (prisma.professorTurma) {
                        await prisma.professorTurma.deleteMany({
                            where: { id_professor: professor.id_professor }
                        });
                    }
                    
                    // Se houver modelo professorMateria definido
                    if (prisma.professorMateria) {
                        await prisma.professorMateria.deleteMany({
                            where: { id_professor: professor.id_professor }
                        });
                    }
                    
                    // Excluir o professor
                    await prisma.professor.delete({
                        where: { id_professor: professor.id_professor }
                    });
                }
            } else if (usuarioExistente.tipo === 1) { // Secretaria
                const secretaria = await prisma.secretaria.findFirst({
                    where: { id_user: id_user }
                });
                
                if (secretaria) {
                    await prisma.secretaria.delete({
                        where: { id_secretaria: secretaria.id_secretaria }
                    });
                }
            }

            // Finalmente, exclui o usuário
            await prisma.user.delete({
                where: { id_user: id_user }
            });

            return res.status(200).json({ message: "Usuário excluído com sucesso!" });
        } catch (error) {
            // Tratamento de erros específicos
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    return res.status(404).json({ message: "Usuário não encontrado!" });
                } else if (error.code === 'P2003') {
                    // Log detalhado para facilitar diagnóstico de problemas futuros
                    console.error("Violação de restrição de chave estrangeira:", error.meta);
                    return res.status(500).json({ 
                        message: "Erro ao excluir usuário: existem registros relacionados que precisam ser removidos primeiro.",
                        constraint: error.meta?.constraint,
                        error: error.message
                    });
                }
            }

            console.error("Erro ao excluir usuário:", error);
            return res.status(500).json({ message: "Erro ao excluir usuário!", error: error.message });
        }
    }

    async consultarUsuario(req, res) {
        try {
            let { id_user } = req.params;
            let userId = id_user;

            // Tenta buscar pelo id_user direto
            let usuario = await prisma.user.findUnique({
                where: { id_user: userId },
                select: {
                    nome: true,
                    email: true,
                    dt_nasc: true,
                    telefone: true,
                    cpf: true,
                    ft_perfil: true,
                    tipo: true
                }
            });

            // Se não achou, tenta como id_professor
            if (!usuario) {
                const prof = await prisma.professor.findUnique({ where: { id_professor: id_user } });
                if (prof) {
                    userId = prof.id_user;
                    usuario = await prisma.user.findUnique({
                        where: { id_user: userId },
                        select: {
                            nome: true,
                            email: true,
                            dt_nasc: true,
                            telefone: true,
                            cpf: true,
                            ft_perfil: true,
                            tipo: true
                        }
                    });
                }
            }
            // Se ainda não achou, tenta como id_aluno
            if (!usuario) {
                const aluno = await prisma.aluno.findUnique({ where: { id_aluno: id_user } });
                if (aluno) {
                    userId = aluno.id_user;
                    usuario = await prisma.user.findUnique({
                        where: { id_user: userId },
                        select: {
                            nome: true,
                            email: true,
                            dt_nasc: true,
                            telefone: true,
                            cpf: true,
                            ft_perfil: true,
                            tipo: true
                        }
                    });
                }
            }
            // Se ainda não achou, tenta como id_secretaria
            if (!usuario) {
                const sec = await prisma.secretaria.findUnique({ where: { id_secretaria: id_user } });
                if (sec) {
                    userId = sec.id_user;
                    usuario = await prisma.user.findUnique({
                        where: { id_user: userId },
                        select: {
                            nome: true,
                            email: true,
                            dt_nasc: true,
                            telefone: true,
                            cpf: true,
                            ft_perfil: true,
                            tipo: true
                        }
                    });
                }
            }

            if (!usuario) {
                return res.status(404).json({ erro: "Usuário não encontrado" });
            }

            // Busca os ids relacionados
            const professor = await prisma.professor.findUnique({ where: { id_user: userId } });
            const aluno = await prisma.aluno.findUnique({ where: { id_user: userId } });
            const secretaria = await prisma.secretaria.findUnique({ where: { id_user: userId } });

            return res.json({
                ...usuario,
                id_professor: professor ? professor.id_professor : null,
                id_aluno: aluno ? aluno.id_aluno : null,
                id_secretaria: secretaria ? secretaria.id_secretaria : null
            });
        } catch (error) {
            return res.status(500).json({
                erro: "Erro ao consultar usuário",
                detalhes: error.message
            });
        }
    }

    // Consultar dados específicos de aluno
    async consultarAluno(req, res) {
        const { id_user } = req.params;
        
        try {
            // Busca dados do aluno relacionados ao usuário
            const aluno = await prisma.aluno.findFirst({
                where: { id_user: id_user },
                include: { turma: true }
            });
            
            if (!aluno) {
                return res.status(404).json({ erro: "Aluno não encontrado" });
            }
            
            return res.json(aluno);
        } catch (error) {
            console.error("Erro ao consultar aluno:", error);
            return res.status(500).json({
                erro: "Erro ao consultar aluno",
                detalhes: error.message
            });
        }
    }
    
    // Consultar dados específicos de professor
    async consultarProfessor(req, res) {
        const { id_user } = req.params;
        
        try {
            // Busca dados do professor relacionados ao usuário
            const professor = await prisma.professor.findFirst({
                where: { id_user: id_user }
            });
            
            if (!professor) {
                return res.status(404).json({ erro: "Professor não encontrado" });
            }
            
            return res.json(professor);
        } catch (error) {
            console.error("Erro ao consultar professor:", error);
            return res.status(500).json({
                erro: "Erro ao consultar professor",
                detalhes: error.message
            });
        }
    }
    
    // Consultar dados específicos de secretaria
    async consultarSecretaria(req, res) {
        const { id_user } = req.params;
        
        try {
            // Busca dados da secretaria relacionados ao usuário
            const secretaria = await prisma.secretaria.findFirst({
                where: { id_user: id_user }
            });
            
            if (!secretaria) {
                return res.status(404).json({ erro: "Secretaria não encontrada" });
            }
            
            return res.json(secretaria);
        } catch (error) {
            console.error("Erro ao consultar secretaria:", error);
            return res.status(500).json({
                erro: "Erro ao consultar secretaria",
                detalhes: error.message
            });
        }
    }
    
    // Atualizar turma do aluno
    async atualizarTurmaAluno(req, res) {
        const { id_user } = req.params;
        const { id_turma } = req.body;
        
        try {
            // Busca o aluno pelo id_user
            const aluno = await prisma.aluno.findFirst({
                where: { id_user: id_user }
            });
            
            if (!aluno) {
                return res.status(404).json({ erro: "Aluno não encontrado" });
            }
            
            // Atualiza a turma do aluno
            const alunoAtualizado = await prisma.aluno.update({
                where: { id_aluno: aluno.id_aluno },
                data: { id_turma }
            });
            
            return res.json(alunoAtualizado);
        } catch (error) {
            console.error("Erro ao atualizar turma do aluno:", error);
            return res.status(500).json({
                erro: "Erro ao atualizar turma do aluno",
                detalhes: error.message
            });
        }
    }
    
    // Atualizar especialidade do professor
    async atualizarEspecialidadeProfessor(req, res) {
        const { id_user } = req.params;
        const { especialidade } = req.body;
        
        try {
            // Busca o professor pelo id_user
            const professor = await prisma.professor.findFirst({
                where: { id_user: id_user }
            });
            
            if (!professor) {
                return res.status(404).json({ erro: "Professor não encontrado" });
            }
            
            // Atualiza a especialidade do professor
            const professorAtualizado = await prisma.professor.update({
                where: { id_professor: professor.id_professor },
                data: { especialidade }
            });
            
            return res.json(professorAtualizado);
        } catch (error) {
            console.error("Erro ao atualizar especialidade do professor:", error);
            return res.status(500).json({
                erro: "Erro ao atualizar especialidade do professor",
                detalhes: error.message
            });
        }
    }
    
    // Atualizar setor da secretaria
    async atualizarSetorSecretaria(req, res) {
        const { id_user } = req.params;
        const { setor } = req.body;
        
        try {
            // Busca a secretaria pelo id_user
            const secretaria = await prisma.secretaria.findFirst({
                where: { id_user: id_user }
            });
            
            if (!secretaria) {
                return res.status(404).json({ erro: "Secretaria não encontrada" });
            }
            
            // Atualiza o setor da secretaria
            const secretariaAtualizada = await prisma.secretaria.update({
                where: { id_secretaria: secretaria.id_secretaria },
                data: { setor }
            });
            
            return res.json(secretariaAtualizada);
        } catch (error) {
            console.error("Erro ao atualizar setor da secretaria:", error);
            return res.status(500).json({
                erro: "Erro ao atualizar setor da secretaria",
                detalhes: error.message
            });
        }
    }
    
    // Listar turmas associadas ao professor
    async listarTurmasProfessor(req, res) {
        const { id_user } = req.params;
        
        try {
            // Busca o professor pelo id_user
            const professor = await prisma.professor.findFirst({
                where: { id_user: id_user }
            });
            
            if (!professor) {
                return res.status(404).json({ erro: "Professor não encontrado" });
            }
            
            // Busca as turmas associadas ao professor através da tabela de relacionamento
            const turmasProfessor = await prisma.professorTurma.findMany({
                where: { id_professor: professor.id_professor },
                include: {
                    turma: {
                        include: {
                            curso: true
                        }
                    }
                }
            });
            
            // Extrair apenas as turmas da relação
            const turmas = turmasProfessor.map(rel => rel.turma);
            
            return res.json(turmas);
        } catch (error) {
            console.error("Erro ao listar turmas do professor:", error);
            return res.status(500).json({
                erro: "Erro ao listar turmas do professor",
                detalhes: error.message
            });
        }
    }
    
    // Atualizar turmas do professor
    async atualizarTurmasProfessor(req, res) {
        const { id_user } = req.params;
        const { turmas } = req.body; // Array de IDs de turmas
        
        try {
            // Busca o professor pelo id_user
            const professor = await prisma.professor.findFirst({
                where: { id_user: id_user }
            });
            
            if (!professor) {
                return res.status(404).json({ erro: "Professor não encontrado" });
            }
            
            // Primeiro, remove todas as associações existentes do professor com turmas
            await prisma.professorTurma.deleteMany({
                where: { id_professor: professor.id_professor }
            });
            
            // Em seguida, cria novas associações do professor com as turmas selecionadas
            if (turmas && turmas.length > 0) {
                const novasAssociacoes = turmas.map(id_turma => ({
                    id_professor: professor.id_professor,
                    id_turma: id_turma
                }));
                
                await prisma.professorTurma.createMany({
                    data: novasAssociacoes
                });
            }
            
            return res.json({ mensagem: "Turmas atualizadas com sucesso" });
        } catch (error) {
            console.error("Erro ao atualizar turmas do professor:", error);
            return res.status(500).json({
                erro: "Erro ao atualizar turmas do professor",
                detalhes: error.message
            });
        }
    }

    // => Turmas

    async cadTurma(req, res) {
        const { nome, dt_inicio, semestres, id_curso, id_professor } = req.body;

        try {
            // Criar a turma sem associação ao professor inicialmente
            const turma = await prisma.turma.create({
                data: {
                    nome,
                    dt_inicio: new Date(dt_inicio),
                    semestres,
                    id_curso
                }
            });
            
            // Se um professor foi especificado, criar a relação professor-turma
            if (id_professor) {
                await prisma.professorTurma.create({
                    data: {
                        id_professor,
                        id_turma: turma.id_turma
                    }
                });
            }

            return res.status(201).json(turma);
        } catch (error) {
            console.error("Erro ao cadastrar turma:", error);
            return res.status(500).json({
                erro: "Erro ao cadastrar turma",
                detalhes: error.message
            });
        }
    }

    async listarTurmas(req, res) {
        try {
            const turmas = await prisma.turma.findMany({
                include: {
                    curso: true,
                    professoresRelation: true,
                    alunos: true
                }
            });

            return res.status(200).json(turmas);
        } catch (error) {
            console.error("Erro ao listar turmas:", error);
            return res.status(500).json({
                erro: "Erro ao listar turmas",
                detalhes: error.message
            });
        }
    }

    async editarTurma(req, res) {
        const { id } = req.params;
        const { nome, dt_inicio, semestres, id_curso } = req.body;

        try {
            const turma = await prisma.turma.update({
                where: { id_turma: id },
                data: {
                    nome,
                    dt_inicio: new Date(dt_inicio),
                    semestres,
                    curso: {
                        connect: { id_curso }
                    }
                }
            });

            return res.status(200).json(turma);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return res.status(404).json({ erro: "Turma não encontrada" });
            }
            console.error("Erro ao editar turma:", error);
            return res.status(500).json({
                erro: "Erro ao editar turma",
                detalhes: error.message
            });
        }
    }

    async delTurma(req, res) {
        const id_del = req.params.id;
        try {
            // Remove vínculos de alunos
            await prisma.aluno.deleteMany({
                where: { id_turma: id_del }
            });
            // Remove vínculos de professores
            await prisma.professorTurma.deleteMany({
                where: { id_turma: id_del }
            });
            // Agora deleta a turma
            await prisma.turma.delete({
                where: { id_turma: id_del }
            });
            return res.status(204).json({ message: "Turma excluída e vínculos removidos" });
        } catch (error) {
            return res.status(400).json({ error: error });
        }
    }

    // Vincular professor a turma
    async vincularProfessorTurma(req, res) {
        const { id_professor, id_turma } = req.body;
        try {
            const vinculo = await prisma.professorTurma.create({
                data: {
                    id_professor,
                    id_turma
                }
            });
            return res.status(201).json(vinculo);
        } catch (error) {
            console.error("Erro ao vincular professor à turma:", error);
            return res.status(500).json({
                erro: "Erro ao vincular professor à turma",
                detalhes: error.message
            });
        }
    }

}
