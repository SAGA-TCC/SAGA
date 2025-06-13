import prisma from "../util/prisma.js";

export class ProfController {
    async listarTurmasProf(req, res) {
        try {
            const id_user = req.userId;
            if (!id_user) {
                return res.status(400).json({ erro: "Usuário não autenticado." });
            }

            const professor = await prisma.professor.findUnique({
                where: { id_user }
            });

            if (!professor) {
                return res.status(404).json({ erro: "Professor não encontrado." });
            }

            const professorTurmas = await prisma.professorTurma.findMany({
                where: { id_professor: professor.id_professor },
                include: {
                    turma: {
                        include: {
                            curso: true
                        }
                    }
                }
            });

            const turmas = professorTurmas.map(pt => pt.turma);
            return res.status(200).json(turmas);
        } catch (error) {
            console.error("Erro ao buscar turmas do professor:", error);
            return res.status(500).json({ erro: "Erro ao buscar turmas do professor", detalhes: error.message });
        }
    }

    async buscarProfessorPorUser(req, res) {
        try {
            const id_user = req.userId;
            if (!id_user) {
                return res.status(400).json({ erro: "Usuário não autenticado." });
            }

            const professor = await prisma.professor.findUnique({
                where: { id_user }
            });

            if (!professor) {
                return res.status(404).json({ erro: "Professor não encontrado para este usuário." });
            }

            return res.status(200).json(professor);
        } catch (error) {
            console.error("Erro ao buscar professor:", error);
            return res.status(500).json({ erro: "Erro ao buscar professor", detalhes: error.message });
        }
    }

    async listarAlunosTurma(req, res) {
        try {
            const id_user = req.userId;
            if (!id_user) {
                return res.status(400).json({ erro: "Usuário não autenticado." });
            }

            const { id_turma } = req.params;
            if (!id_turma) {
                return res.status(400).json({ erro: "ID da turma é obrigatório." });
            }

            const professor = await prisma.professor.findUnique({
                where: { id_user }
            });

            if (!professor) {
                return res.status(404).json({ erro: "Professor não encontrado." });
            }

            const professorTurma = await prisma.professorTurma.findFirst({
                where: {
                    id_professor: professor.id_professor,
                    id_turma
                }
            });

            if (!professorTurma) {
                return res.status(403).json({ erro: "Professor não tem acesso a esta turma." });
            }

            const alunos = await prisma.aluno.findMany({
                where: { id_turma },
                include: {
                    user: true
                }
            });

            const alunosFormatados = alunos.map(aluno => ({
                id_aluno: aluno.id_aluno,
                ...aluno.user
            }));

            return res.status(200).json(alunosFormatados);
        } catch (error) {
            console.error("Erro ao buscar alunos da turma:", error);
            return res.status(500).json({ erro: "Erro ao buscar alunos da turma", detalhes: error.message });
        }
    }    async materiasProf(req, res) {
        try {
            const id_user = req.userId;
            if (!id_user) {
                return res.status(400).json({ erro: "Usuário não autenticado." });
            }

            // Pode vir do parâmetro da URL ou buscar pelo usuário autenticado
            let id_professor = req.params.id_professor;
            
            if (!id_professor) {
                // Se não veio na URL, busca pelo usuário autenticado
                const professor = await prisma.professor.findUnique({
                    where: { id_user }
                });

                if (!professor) {
                    return res.status(404).json({ erro: "Professor não encontrado." });
                }
                
                id_professor = professor.id_professor;
            } else {
                // Se veio na URL, verifica se o usuário tem acesso a esse professor
                const professor = await prisma.professor.findUnique({
                    where: { 
                        id_professor,
                        id_user // Garante que o usuário autenticado é o dono deste professor
                    }
                });

                if (!professor) {
                    return res.status(403).json({ erro: "Acesso negado a este professor." });
                }
            }

            const materias = await prisma.materia.findMany({
                where: { id_prof: id_professor },
                include: {
                    curso: {
                        select: {
                            nome: true,
                            codigo: true
                        }
                    }
                },
                orderBy: {
                    nome: 'asc'
                }
            });

            return res.status(200).json(materias);
        } catch (error) {
            console.error("Erro ao buscar matérias do professor:", error);
            return res.status(500).json({ erro: "Erro ao buscar matérias do professor", detalhes: error.message });
        }
    }

    async realizarChamada(req, res) {
        try {
            const id_user = req.userId;
            if (!id_user) {
                return res.status(400).json({ erro: "Usuário não autenticado." });
            }

            const { id_turma, id_materia, data, presencas } = req.body;

            if (!id_turma || !id_materia || !data || !Array.isArray(presencas)) {
                return res.status(400).json({ erro: "Dados obrigatórios: id_turma, id_materia, data e presencas (array)." });
            }

            const professor = await prisma.professor.findUnique({
                where: { id_user }
            });

            if (!professor) {
                return res.status(404).json({ erro: "Professor não encontrado." });
            }

            const professorTurma = await prisma.professorTurma.findFirst({
                where: {
                    id_professor: professor.id_professor,
                    id_turma
                }
            });

            if (!professorTurma) {
                return res.status(403).json({ erro: "Professor não tem acesso a esta turma." });
            }

            const materia = await prisma.materia.findFirst({
                where: {
                    id_materia,
                    id_professor: professor.id_professor
                }
            });

            if (!materia) {
                return res.status(403).json({ erro: "Professor não tem acesso a esta matéria." });
            }

            const dataFormatada = new Date(data);
            const resultados = [];

            for (const presenca of presencas) {
                const { id_aluno, presente } = presenca;

                if (typeof id_aluno !== 'number' || typeof presente !== 'boolean') {
                    return res.status(400).json({ erro: "Cada presença deve ter id_aluno (number) e presente (boolean)." });
                }

                const chamadaExistente = await prisma.chamada.findFirst({
                    where: {
                        id_aluno,
                        id_turma,
                        id_materia,
                        data: dataFormatada
                    }
                });

                if (chamadaExistente) {
                    await prisma.chamada.update({
                        where: { id_chamada: chamadaExistente.id_chamada },
                        data: { presente }
                    });
                } else {
                    await prisma.chamada.create({
                        data: {
                            id_aluno,
                            id_turma,
                            id_materia,
                            data: dataFormatada,
                            presente
                        }
                    });
                }

                resultados.push({ id_aluno, presente });
            }

            return res.status(200).json({ mensagem: "Chamada realizada com sucesso!", resultados });
        } catch (error) {
            console.error("Erro ao realizar chamada:", error);
            return res.status(500).json({ erro: "Erro ao realizar chamada", detalhes: error.message });
        }
    }

    async listarChamada(req, res) {
        try {
            const id_user = req.userId;
            if (!id_user) {
                return res.status(400).json({ erro: "Usuário não autenticado." });
            }

            const { id_turma } = req.params;
            if (!id_turma) {
                return res.status(400).json({ erro: "ID da turma é obrigatório." });
            }

            const professor = await prisma.professor.findUnique({
                where: { id_user }
            });

            if (!professor) {
                return res.status(404).json({ erro: "Professor não encontrado." });
            }

            const professorTurma = await prisma.professorTurma.findFirst({
                where: {
                    id_professor: professor.id_professor,
                    id_turma
                }
            });

            if (!professorTurma) {
                return res.status(403).json({ erro: "Professor não tem acesso a esta turma." });
            }

            const chamadas = await prisma.chamada.findMany({
                where: { id_turma },
                include: {
                    aluno: {
                        include: {
                            user: true
                        }
                    },
                    materia: true
                },
                orderBy: [
                    { data: 'desc' },
                    { id_aluno: 'asc' }
                ]
            });

            return res.status(200).json(chamadas);
        } catch (error) {
            console.error("Erro ao listar chamadas:", error);
            return res.status(500).json({ erro: "Erro ao listar chamadas", detalhes: error.message });
        }
    }

    async lancarNotas(req, res) {
        try {
            const id_user = req.userId;
            if (!id_user) {
                return res.status(400).json({ erro: "Usuário não autenticado." });
            }

            const { id_turma, id_materia, notas } = req.body;

            if (!id_turma || !id_materia || !Array.isArray(notas)) {
                return res.status(400).json({ erro: "Dados obrigatórios: id_turma, id_materia e notas (array)." });
            }

            const professor = await prisma.professor.findUnique({
                where: { id_user }
            });

            if (!professor) {
                return res.status(404).json({ erro: "Professor não encontrado." });
            }

            const professorTurma = await prisma.professorTurma.findFirst({
                where: {
                    id_professor: professor.id_professor,
                    id_turma
                }
            });

            if (!professorTurma) {
                return res.status(403).json({ erro: "Professor não tem acesso a esta turma." });
            }

            const materia = await prisma.materia.findFirst({
                where: {
                    id_materia,
                    id_professor: professor.id_professor
                }
            });

            if (!materia) {
                return res.status(403).json({ erro: "Professor não tem acesso a esta matéria." });
            }

            const resultados = [];

            for (const notaAluno of notas) {
                const { id_aluno, valor } = notaAluno;

                if (typeof id_aluno !== 'number' || typeof valor !== 'number') {
                    return res.status(400).json({ erro: "Cada nota deve ter id_aluno (number) e valor (number)." });
                }

                if (valor < 0 || valor > 10) {
                    return res.status(400).json({ erro: "Valor da nota deve estar entre 0 e 10." });
                }

                const notaExistente = await prisma.nota.findFirst({
                    where: {
                        id_aluno,
                        id_materia
                    }
                });

                if (notaExistente) {
                    await prisma.nota.update({
                        where: { id_nota: notaExistente.id_nota },
                        data: { valor }
                    });
                } else {
                    await prisma.nota.create({
                        data: {
                            id_aluno,
                            id_materia,
                            valor
                        }
                    });
                }

                resultados.push({ id_aluno, valor });
            }

            return res.status(200).json({ mensagem: "Notas lançadas/atualizadas com sucesso!", resultados });
        } catch (error) {
            console.error("Erro ao lançar notas:", error);
            return res.status(500).json({ erro: "Erro ao lançar notas", detalhes: error.message });
        }
    }
}