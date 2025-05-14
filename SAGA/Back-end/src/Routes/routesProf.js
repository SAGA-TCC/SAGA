import { Router } from "express";
import { LoginController } from "../controller/loginController.js";
import { tokenAuthenticate } from "../middlewares/authenticate.js";
import { SecController } from "../controller/secController.js";
import { ProfController } from "../controller/profController.js";

export const routerProf = new Router();

const profController = new ProfController();

// Rota para buscar todas as turmas associadas ao professor
routerProf.get("/prof/turmas/:id_professor", tokenAuthenticate, (req, res) => profController.listarTurmasProf(req, res));

// Rota para buscar todas as matérias associadas ao professor
routerProf.get("/prof/materias/:id_professor", tokenAuthenticate, (req, res) => profController.materiasProf(req, res));

// Rota para buscar todos os alunos de uma turma associada ao professor
routerProf.get("/prof/alunos/:id_turma", tokenAuthenticate, (req, res) => profController.listarAlunosTurma(req, res));
//Rota para realizar a chamada

routerProf.post("/prof/chamada", tokenAuthenticate, (req, res) => profController.realizarChamada(req, res));

routerProf.get("/prof/chamada/:id_turma", tokenAuthenticate, (req, res) => profController.listarChamada(req, res));

routerProf.post("/prof/lancarNotas", tokenAuthenticate, (req, res) => profController.lancarNotas(req, res));

