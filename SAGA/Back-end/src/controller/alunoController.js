import prisma from "../util/prisma.js";
// import { startOfDay, endOfDay } from "date-fns";

export class AlunoController {
    async listInfoCurso(req, res) {
        try {
            const id_user = req.userId;
            if (!id_user) {
                return res.status(400).json({ message: "Usuário não autenticado." });
            }

            const aluno = await prisma.aluno.findUnique({
                where: { id_user },
                include: {
                    turma: {
                        include: {
                            curso: { include: { materias: true } },
                            professoresRelation: {
                                include: {
                                    professor: {
                                        include: { user: true }
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

            const materias = (aluno.turma.curso.materias || []).map(materia => {
                const relacao = (aluno.turma.professoresRelation || []).find(
                    rel => rel.professor.id_materia === materia.id_materia
                );
                return {
                    materia: materia.nome,
                    cargaHoraria: materia.ch_total,
                    professor: relacao ? relacao.professor.user.nome : "Não definido"
                };
            });

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

            const aluno = await prisma.aluno.findUnique({
                where: { id_user },
                include: {
                    turma: {
                        include: {
                            curso: {
                                include: {
                                    materias: true
                                }
                            },
                            Chamadas: {
                                include: {
                                    presencas: {
                                        where: { id_aluno: id_user }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            if (!aluno) {
                return res.status(404).json({ message: "Aluno não encontrado." });
            }

            if (!aluno.turma || !aluno.turma.curso) {
                return res.status(404).json({ message: "Informações do curso não encontradas." });
            }

            const materiasInfo = aluno.turma.curso.materias
                .filter(materia => materia.codigo.toString().startsWith(modulo))
                .map(materia => ({
                    nome: materia.nome,
                    codigo: materia.codigo,
                    descricao: materia.descricao,
                    ch_total: materia.ch_total
                }));

            const totalChamadas = aluno.turma.Chamadas.length;
            const presencas = aluno.turma.Chamadas.flatMap(chamada =>
                chamada.presencas.filter(presenca => presenca.presente)
            ).length;

            const frequencia = totalChamadas > 0 ? (presencas / totalChamadas) * 100 : 0;

            const response = {
                curso: aluno.turma.curso.nome,
                turma: aluno.turma.nome,
                modulo,
                materias: materiasInfo,
                frequencia: `${frequencia.toFixed(2)}%`
            };

            return res.status(200).json(response);

        } catch (error) {
            console.error("Erro ao listar informações do módulo:", error.message);
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