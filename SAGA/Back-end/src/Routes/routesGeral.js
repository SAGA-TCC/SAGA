import { Router } from "express";
import { LoginController } from "../controller/loginController.js";
import { commonController } from "../controller/commonController.js";
import { tokenAuthenticate } from "../middlewares/authenticate.js";

export const routerGeral = new Router();
const loginController = new LoginController();
const controller = new commonController();

routerGeral.post('/login', loginController.auth);
routerGeral.get('/info', tokenAuthenticate, controller.info);
routerGeral.get('/info/:id_user', tokenAuthenticate, controller.info);
routerGeral.get('/token', tokenAuthenticate);


