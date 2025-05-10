import { Router } from "express";
import { tokenAuthenticate } from "../middlewares/authenticate.js";
import { SecController } from "../controller/secController.js";

export const routerSec = new Router();

const secController = new SecController()
// => Curso
routerSec.post('/sec/curso', tokenAuthenticate, secController.cadCurso);
routerSec.get('/sec/listarCursos', tokenAuthenticate, secController.listarCursos);
routerSec.put('/sec/editarCurso/:id_curso', tokenAuthenticate, secController.editarCurso);
routerSec.delete('/sec/excluirCurso/:id_curso', tokenAuthenticate, secController.excluirCurso);

// => Materia
routerSec.post('/sec/materia/:id_curso', tokenAuthenticate, secController.cadMateria);
routerSec.get('/sec/listarMaterias/:id_curso', tokenAuthenticate, secController.listarMaterias);
routerSec.put('/sec/editarMateria/:id_materia', tokenAuthenticate, secController.editarMateria);
routerSec.delete('/sec/excluirMateria/:id_materia', tokenAuthenticate, secController.excluirMateria);

// => Usuario
routerSec.post('/sec/cad',tokenAuthenticate, secController.criarUsuario);
// => usuario aluno
routerSec.post('/sec/cadAluno', tokenAuthenticate, secController.cadAluno);
// => usuario professor
routerSec.post('/sec/cadProfessor', tokenAuthenticate, secController.cadProfessor);
routerSec.post('/sec/vicularProfessor', tokenAuthenticate, secController.vincularProfessorTurma);
// => usuario secretaria
routerSec.post('/sec/cadSecretaria', secController.cadSecretaria);

routerSec.get('/sec/listarUsuarios', tokenAuthenticate, secController.listarUsuarios);
routerSec.put('/sec/editarUsuario/:id_user', tokenAuthenticate, secController.editarUsuario);
routerSec.delete('/sec/excluirUsuario/:id_user', tokenAuthenticate, secController.excluirUsuario);
routerSec.get('/sec/consultarUsuario/:id_user', tokenAuthenticate, secController.consultarUsuario);

//Turma
routerSec.post('/sec/Turma/cadastrar', tokenAuthenticate, secController.cadTurma)
routerSec.delete('/sec/Turma/deletar/:id', tokenAuthenticate, secController.delTurma)
routerSec.get('/sec/Turma/listar', tokenAuthenticate, secController.listarTurmas)
routerSec.put('/sec/Turma/editar/:id', tokenAuthenticate, secController.editarTurma)
