import prisma from "../util/prisma.js";

export class AlunoController {
    async listInfoCurso(req, res) {
        try {
            const id_user = req.user.id_user;

            const aluno = await prisma.aluno.findUnique({
                where: { id_user }, // 👈 Isso agora estará definido corretamente
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

            if (!aluno) {
                return res.status(404).json({ message: "Aluno não encontrado." });
            }

            // Organizar a resposta
            const materiasInfo = aluno.turma.curso.materias.map(materia => {
                return {
                    nome: materia.nome,
                    carga_horaria: materia.ch_total,
                    codigo: materia.codigo
                };
            });

            const professoresInfo = aluno.turma.professoresRelation.map(relation => {
                return {
                    nome: relation.professor.user.nome,
                    email: relation.professor.user.email
                };
            });

            const response = {
                curso: aluno.turma.curso.nome,
                turma: aluno.turma.nome,
                materias: materiasInfo,
                professores: professoresInfo
            };

            return res.status(200).json(response);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor." });
        }
    }
}
// 