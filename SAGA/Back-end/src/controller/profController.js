import prisma from "../util/prisma.js";
import { Prisma } from '@prisma/client';




export class ProfController {
    // Retorna todas as turmas associadas ao professor
    async listarTurmasProf(req, res) {
        const { id_professor } = req.params;
        try {
            const turmas = await prisma.professorTurma.findMany({
                where: { id_professor },
                include: {
                    turma: {
                        include: {
                            curso: true
                        }
                    }
                }
            });
            // Retorna apenas os dados da turma
            return res.status(200).json(turmas.map(v => v.turma));
        } catch (error) {
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
            return res.status(200).json(alunos.map(v => v.user));
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
        const { id_professor, id_turma, data, presencas } = req.body;

        if (!Array.isArray(presencas)) {
            return res.status(400).json({ erro: "O campo 'presencas' deve ser um array." });
        }

        try {
            // Verifica se a turma existe e se o professor está associado a ela
            const turma = await prisma.professorTurma.findFirst({
                where: {
                    id_professor,
                    id_turma
                }
            });

            if (!turma) {
                return res.status(404).json({ erro: "Turma não encontrada ou professor não associado a esta turma." });
            }

            // Realiza a chamada
            const chamada = await prisma.chamada.create({
                data: {
                    id_professor,
                    id_turma,
                    data,
                    presencas: {
                        create: presencas.map(p => ({
                            id_aluno: p.id_aluno,
                            presente: p.presente
                        }))
                    }
                },
                include: { presencas: true }
            });

            return res.status(200).json({ sucesso: "Chamada realizada com sucesso!" });
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao realizar chamada", detalhes: error.message });
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

    async lancarNota(req, res) {
        const { id_aluno, id_materia, id_turma, nota, bimestre, id_professor } = req.body;

        if (!id_aluno || !id_materia || !id_turma || typeof nota !== "number" || !bimestre || !id_professor
        ) {
            return res.status(400).json({ erro: "Dados obrigatórios faltando ou inválidos." });
        }

        try {
            // Verifica se já existe uma nota lançada para esse aluno, matéria, turma e bimestre
            const notaExistente = await prisma.nota.findFirst({
                where: { id_aluno, id_materia, id_turma, bimestre }
            });

            // Garante que nota é um número válido
            const valorNota = Number(nota);
            if (isNaN(valorNota)) {
                return res.status(400).json({ erro: "Nota inválida." });
            }

            // Log para debug
            console.log('Dados enviados para o Prisma:', { id_aluno, id_materia, id_turma, id_professor, bimestre, valor: valorNota });

            let notaLancada;
            if (notaExistente) {
                // Atualiza a nota existente
                notaLancada = await prisma.nota.update({
                    where: { id: notaExistente.id },
                    data: { valor: valorNota, id_professor }
                });
            } else {
                // Cria uma nova nota
                notaLancada = await prisma.nota.create({
                    data: {
                        id_aluno,
                        id_materia,
                        id_turma,
                        id_professor,
                        bimestre,
                        valor: valorNota
                    }
                });
            }

            return res.status(200).json({ sucesso: "Nota lançada com sucesso!", nota: notaLancada });
        } catch (error) {
            console.error('Erro ao lançar nota:', error);
            return res.status(500).json({ erro: "Erro ao lançar nota", detalhes: error.message });
        }
    }
}

