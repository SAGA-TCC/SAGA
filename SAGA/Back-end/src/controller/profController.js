import prisma from "../util/prisma.js";
import { Prisma } from '@prisma/client';




export class ProfController {    // Retorna todas as turmas associadas ao professor
    async listarTurmasProf(req, res) {
        const { id_professor } = req.params;
        try {
            // Verificar se o professor existe
            const professor = await prisma.professor.findUnique({
                where: { id_professor }
            });

            if (!professor) {
                return res.status(404).json({ erro: "Professor não encontrado" });
            }

            const professorTurmas = await prisma.professorTurma.findMany({
                where: { id_professor },
                include: {
                    turma: {
                        include: {
                            curso: true
                        }
                    }
                }
            });

            // Extrair apenas as turmas com as informações do curso
            const turmas = professorTurmas.map(pt => pt.turma);
            
            return res.status(200).json(turmas);
        } catch (error) {
            console.error("Erro ao buscar turmas do professor:", error);
            return res.status(500).json({ erro: "Erro ao buscar turmas do professor", detalhes: error.message });
        }
    }

    // Retorna todos os alunos de uma turma associada ao professor
    async listarAlunosTurma(req, res) {
        const { id_turma } = req.params;
        try {
            const alunos = await prisma.aluno.findMany({
                where: { id_turma },
                include: {
                    user: true
                }
            });
            // Retorna id_aluno + dados do usuário
            return res.status(200).json(alunos.map(v => ({
                id_aluno: v.id_aluno,
                ...v.user
            })));
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao buscar alunos da turma", detalhes: error.message });
        }
    }

    // Retorna todas as matérias associadas ao professor
    async materiasProf(req, res) {
        const { id_professor } = req.params;
        try {
            // Busca todas as turmas do professor
            const turmas = await prisma.professorTurma.findMany({
                where: { id_professor },
                include: {
                    turma: {
                        include: {
                            curso: {
                                include: {
                                    materias: true
                                }
                            }
                        }
                    }
                }
            });

            // Coleta todas as matérias dos cursos das turmas
            const materias = turmas.flatMap(t => t.turma.curso.materias);
            return res.status(200).json(materias);
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao buscar matérias do professor", detalhes: error.message });
        }
    }


    // Realiza a chamada dos alunos de uma turma associada ao professor
    async realizarChamada(req, res) {
        try {
            const { id_professor, id_turma, data, presencas } = req.body;

            if (!id_professor || !id_turma || !data || !Array.isArray(presencas)) {
                return res.status(400).json({ erro: "Dados obrigatórios faltando ou inválidos." });
            }

            if (presencas.length === 0) {
                return res.status(400).json({ erro: "Nenhuma presença informada." });
            }

            // Cria a chamada e as presenças associadas
            const chamada = await prisma.chamada.create({
                data: {
                    id_professor,
                    id_turma,
                    data: new Date(data),
                    presencas: {
                        create: presencas.map(p => ({
                            id_aluno: p.id_aluno,
                            presente: p.presente
                        }))
                    }
                },
                include: {
                    presencas: true
                }
            });

            return res.status(201).json({ mensagem: "Chamada lançada com sucesso!", chamada });
        } catch (error) {
            console.error("Erro ao lançar chamada:", error);
            return res.status(500).json({ erro: "Erro ao lançar chamada", detalhes: error.message });
        }
    }

    async listarChamada(req, res) {
        const { id_turma } = req.params;
        try {
            const chamadas = await prisma.chamada.findMany({
                where: { id_turma },
                include: {
                    presencas: {
                        include: {
                            aluno: {
                                include: {
                                    user: true
                                }
                            }
                        }
                    }
                }
            });
            return res.status(200).json(chamadas);
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao buscar chamadas", detalhes: error.message });
        }
    }

    //lançar notas 

    // Lança notas para uma avaliação (Nota) de uma turma, matéria e professor
    async lancarNotas(req, res) {
        const { id_professor, id_turma, id_materia, tipo_avaliacao, bimestre, notas } = req.body;

        if (!Array.isArray(notas) || !id_professor || !id_turma || !id_materia || !bimestre) {
            return res.status(400).json({ erro: "Dados obrigatórios faltando ou inválidos." });
        }

        try {
            // Verifica se o professor está associado à turma
            const relacao = await prisma.professorTurma.findFirst({
                where: { id_professor, id_turma }
            });

            if (!relacao) {
                return res.status(404).json({ erro: "Professor não associado a essa turma." });
            }

            const resultados = [];

            for (const n of notas) {
                const { id_aluno, valor } = n;
                // Procura se já existe nota para esse aluno/matéria/turma/bimestre
                let notaExistente = await prisma.nota.findFirst({
                    where: {
                        id_professor,
                        id_turma,
                        id_materia,
                        tipo_avaliacao: bimestre
                    }
                });

                let notaAluno;
                if (!notaExistente) {
                    // Cria a nota e o registro do aluno
                    notaExistente = await prisma.nota.create({
                        data: {
                            id_professor,
                            id_turma,
                            id_materia,
                            tipo_avaliacao: bimestre,
                            notasAlunos: {
                                create: {
                                    id_aluno,
                                    valor
                                }
                            }
                        },
                        include: { notasAlunos: true }
                    });
                    notaAluno = notaExistente.notasAlunos[0];
                } else {
                    // Verifica se já existe nota para o aluno
                    const notaAlunoExistente = await prisma.notaAluno.findFirst({
                        where: {
                            id_nota: notaExistente.id_nota,
                            id_aluno
                        }
                    });
                    if (notaAlunoExistente) {
                        // Atualiza a nota do aluno
                        notaAluno = await prisma.notaAluno.update({
                            where: { id_nota_aluno: notaAlunoExistente.id_nota_aluno },
                            data: { valor }
                        });
                    } else {
                        // Cria nota para o aluno
                        notaAluno = await prisma.notaAluno.create({
                            data: {
                                id_nota: notaExistente.id_nota,
                                id_aluno,
                                valor
                            }
                        });
                    }
                }
                resultados.push({ id_aluno, valor: notaAluno.valor });
            }

            return res.status(200).json({ sucesso: "Notas lançadas/atualizadas com sucesso!", resultados });
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao lançar notas", detalhes: error.message });
        }
    }

    async buscarProfessorPorUser(req, res) {
        const { id_user } = req.params;
        try {
            const professor = await prisma.professor.findUnique({
                where: { id_user }
            });
            if (!professor) {
                return res.status(404).json({ error: "Professor não encontrado para este usuário" });
            }
            res.json(professor);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar professor", detalhes: error.message });
        }
    }

    // async lancarNotas(req, res) {
    //     const { id_professor, id_materia, id_turma, bimestre, notas } = req.body;

    //     if (!id_professor || !id_materia || !id_turma || !bimestre || !Array.isArray(notas)) {
    //         return res.status(400).json({ erro: "Dados obrigatórios faltando ou inválidos." });
    //     }

    //     try {
    //         const resultados = [];

    //         for (const notaInfo of notas) {
    //             const { id_aluno, nota } = notaInfo;

    //             if (!id_aluno || typeof nota !== "number" || isNaN(nota)) {
    //                 resultados.push({ id_aluno, erro: "Dados inválidos para o aluno." });
    //                 continue;
    //             }

    //             // Verifica se o aluno existe
    //             const alunoExiste = await prisma.aluno.findUnique({
    //                 where: { id_aluno }
    //             });

    //             if (!alunoExiste) {
    //                 resultados.push({ id_aluno, erro: "Aluno não encontrado no banco de dados." });
    //                 continue;
    //             }

    //             const notaExistente = await prisma.nota.findFirst({
    //                 where: { id_aluno, id_materia, id_turma, bimestre }
    //             });

    //             let notaLancada;
    //             if (notaExistente) {
    //                 notaLancada = await prisma.nota.update({
    //                     where: { id: notaExistente.id },
    //                     data: {
    //                         valor: nota,
    //                         id_professor
    //                     }
    //                 });
    //             } else {
    //                 notaLancada = await prisma.nota.create({
    //                     data: {
    //                         id_aluno,
    //                         id_materia,
    //                         id_turma,
    //                         bimestre,
    //                         valor: nota,
    //                         id_professor
    //                     }
    //                 });
    //             }

    //             resultados.push({ id_aluno, sucesso: "Nota lançada com sucesso.", nota: notaLancada.valor });
    //         }

    //         return res.status(200).json({ resultados });
    //     } catch (error) {
    //         console.error("Erro ao lançar notas:", error);
    //         return res.status(500).json({ erro: "Erro ao lançar notas", detalhes: error.message });
    //     }
    // }

}

