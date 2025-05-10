import { Router } from "express";
import { LoginController } from "../controller/loginController.js";
import { tokenAuthenticate } from "../middlewares/authenticate.js";
import { SecController } from "../controller/secController.js";

export const routerAluno = new Router();
