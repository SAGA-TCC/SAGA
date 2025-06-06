import prisma from "../util/prisma.js";
// import { startOfDay, endOfDay } from "date-fns";

export class AlunoController {
    async listInfoCurso(req, res) {
        try {
            const id_user = req.userId;
            if (!id_user) {
                return res.status(400).json({ message: "Usuário não autenticado." });
            }

            // Inclui o professor e o user do professor em cada matéria
            const aluno = await prisma.aluno.findUnique({
                where: { id_user },
                include: {
                    turma: {
                        include: {
                            curso: {
                                include: {
                                    materias: {
                                        include: {
                                            professor: {
                                                include: {
                                                    user: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            if (!aluno || !aluno.turma || !aluno.turma.curso) {
                return res.status(404).json({ message: "Informações do curso não encontradas." });
            }

            // Para cada matéria, pega o nome do professor vinculado (se houver)
            const materias = (aluno.turma.curso.materias || []).map(materia => ({
                materia: materia.nome,
                cargaHoraria: materia.ch_total,
                professor: materia.professor && materia.professor.user
                    ? materia.professor.user.nome
                    : "Não definido"
            }));

            return res.status(200).json(materias);

        } catch (error) {
            console.error("Erro ao listar informações do curso:", error, error.stack);
            return res.status(500).json({ message: "Erro interno do servidor." });
        }
    }

    async listModuloInfo(req, res) {
        try {
            const id_user = req.userId;
            if (!id_user) {
                return res.status(400).json({ message: "Usuário não autenticado." });
            }

            const { modulo } = req.params;

            // Busca o aluno, turma e curso
            const aluno = await prisma.aluno.findUnique({
                where: { id_user },
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

            if (!aluno || !aluno.turma || !aluno.turma.curso) {
                return res.status(404).json({ message: "Informações do curso não encontradas." });
            }

            // Filtra as matérias do módulo da turma do aluno
            const materiasModulo = aluno.turma.curso.materias
                .filter(materia => materia.codigo.toString().startsWith(modulo));

            // Para cada matéria, busca as notas do aluno
            const materiasInfo = await Promise.all(materiasModulo.map(async materia => {
                // Busca as notas do aluno para esta matéria e turma
                const notasAluno = await prisma.notaAluno.findMany({
                    where: {
                        id_aluno: aluno.id_aluno,
                        nota: {
                            id_materia: materia.id_materia,
                            id_turma: aluno.turma.id_turma
                        }
                    },
                    include: {
                        nota: true
                    }
                });

                // Separe por tipo de avaliação (exemplo: "B1", "B2", etc)
                const notaB1 = notasAluno.find(n => n.nota.tipo_avaliacao === "B1")?.valor ?? "-";
                const notaB2 = notasAluno.find(n => n.nota.tipo_avaliacao === "B2")?.valor ?? "-";

                return {
                    nome: materia.nome,
                    codigo: materia.codigo,
                    descricao: materia.descricao,
                    ch_total: materia.ch_total,
                    notaB1,
                    notaB2
                };
            }));

            const response = {
                curso: aluno.turma.curso.nome,
                turma: aluno.turma.nome,
                modulo,
                materias: materiasInfo
            };

            return res.status(200).json(response);

        } catch (error) {
            console.error("Erro ao listar informações do módulo:", error);
            return res.status(500).json({ message: "Erro interno do servidor." });
        }
    }

    async getFrequenciaByData(req, res) {
        try {
            const id_user = req.userId;
            if (!id_user) {
                return res.status(400).json({ message: "Usuário não autenticado." });
            }

            const { data } = req.query;

            if (!data) {
                return res.status(400).json({ message: "Data não fornecida. Use o parâmetro ?data=YYYY-MM-DD" });
            }

            const aluno = await prisma.aluno.findUnique({
                where: { id_user },
                include: { turma: true }
            });

            if (!aluno) {
                return res.status(404).json({ message: "Aluno não encontrado." });
            }

            const start = startOfDay(new Date(data));
            const end = endOfDay(new Date(data));

            const chamada = await prisma.chamada.findFirst({
                where: {
                    id_turma: aluno.id_turma,
                    data: {
                        gte: start,
                        lte: end
                    }
                }
            });

            if (!chamada) {
                return res.status(404).json({ message: "Nenhuma chamada encontrada para a data informada." });
            }

            const presenca = await prisma.presenca.findFirst({
                where: {
                    id_chamada: chamada.id_chamada,
                    id_aluno: aluno.id_aluno
                }
            });

            if (!presenca) {
                return res.status(404).json({ message: "Presença do aluno não encontrada na chamada desta data." });
            }

            return res.status(200).json({
                data,
                presente: presenca.presente
            });

        } catch (error) {
            console.error("Erro ao buscar frequência por data:", error.message);
            return res.status(500).json({ message: "Erro interno do servidor." });
        }
    }

    async getPresencasByDia(req, res) {
        try {
            const id_user = req.userId;
            if (!id_user) {
                return res.status(400).json({ message: "Usuário não autenticado." });
            }

            const { data } = req.query;
            if (!data) {
                return res.status(400).json({ message: "Data não fornecida. Use o parâmetro ?data=YYYY-MM-DD" });
            }

            const aluno = await prisma.aluno.findUnique({
                where: { id_user },
                include: { turma: true }
            });

            if (!aluno) {
                return res.status(404).json({ message: "Aluno não encontrado." });
            }

            // Buscar todas as chamadas do dia para a turma do aluno
            const chamadas = await prisma.chamada.findMany({
                where: {
                    id_turma: aluno.id_turma,
                    data: {
                        gte: new Date(data + "T00:00:00.000Z"),
                        lte: new Date(data + "T23:59:59.999Z")
                    }
                },
                include: {
                    professor: { include: { user: true } },
                    presencas: { where: { id_aluno: aluno.id_aluno } },
                    turma: true
                }
            });

            const result = chamadas.map(chamada => ({
                materia: chamada.professor.materias[0]?.nome || "Desconhecida",
                professor: chamada.professor.user.nome,
                presente: chamada.presencas[0]?.presente ?? false
            }));

            return res.status(200).json(result);

        } catch (error) {
            console.error("Erro ao buscar presenças do dia:", error);
            return res.status(500).json({ message: "Erro interno do servidor." });
        }
    }
}