import prisma from "../util/prisma.js";

export class AlunoController {
    async listInfoCurso(req, res) {
        try {
            // Validação de req.user
            if (!req.user || !req.user.id_user) {
                return res.status(400).json({ message: "Usuário não autenticado." });
            }

            const id_user = req.user.id_user;

            // Busca o aluno e suas relações
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

            // Verifica se o aluno foi encontrado
            if (!aluno) {
                return res.status(404).json({ message: "Aluno não encontrado." });
            }

            // Verifica se as relações existem
            if (!aluno.turma || !aluno.turma.curso) {
                return res.status(404).json({ message: "Informações do curso não encontradas." });
            }

            // Organiza as informações das matérias
            const materiasInfo = aluno.turma.curso.materias.map(materia => ({
                nome: materia.nome,
                carga_horaria: materia.ch_total,
                codigo: materia.codigo
            }));

            // Organiza as informações dos professores
            const professoresInfo = aluno.turma.professoresRelation.map(relation => ({
                nome: relation.professor.user.nome,
                email: relation.professor.user.email
            }));

            // Resposta final
            const response = {
                curso: aluno.turma.curso.nome,
                turma: aluno.turma.nome,
                materias: materiasInfo,
                professores: professoresInfo
            };

            return res.status(200).json(response);

        } catch (error) {
            console.error("Erro ao listar informações do curso:", error.message);
            return res.status(500).json({ message: "Erro interno do servidor." });
        }
    }

    // Nova função para listar informações do módulo

    async listModuloInfo(req, res) {
        try {
            // Validação de req.user
            if (!req.user || !req.user.id_user) {
                return res.status(400).json({ message: "Usuário não autenticado." });
            }

            const id_user = req.user.id_user;
            const { modulo } = req.params;

            // Busca o aluno e suas relações
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

            // Verifica se o aluno foi encontrado
            if (!aluno) {
                return res.status(404).json({ message: "Aluno não encontrado." });
            }

            // Verifica se as relações existem
            if (!aluno.turma || !aluno.turma.curso) {
                return res.status(404).json({ message: "Informações do curso não encontradas." });
            }

            // Filtra as matérias pelo módulo
            const materiasInfo = aluno.turma.curso.materias
                .filter(materia => materia.codigo.toString().startsWith(modulo)) // Exemplo: módulo baseado no código
                .map(materia => ({
                    nome: materia.nome,
                    codigo: materia.codigo,
                    descricao: materia.descricao,
                    ch_total: materia.ch_total
                }));

            // Calcula a frequência do aluno
            const totalChamadas = aluno.turma.Chamadas.length;
            const presencas = aluno.turma.Chamadas.flatMap(chamada =>
                chamada.presencas.filter(presenca => presenca.presente)
            ).length;

            const frequencia = totalChamadas > 0 ? (presencas / totalChamadas) * 100 : 0;

            // Resposta final
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
}