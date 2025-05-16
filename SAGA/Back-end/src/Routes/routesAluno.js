import { Router } from "express";
import { tokenAuthenticate } from "../middlewares/authenticate.js";
import { AlunoController } from "../controller/alunoController.js";

export const routerAluno = new Router();
const alunoController = new AlunoController();

routerAluno.get('/aluno/listMateria', tokenAuthenticate, (req, res) => alunoController.listInfoCurso(req, res));