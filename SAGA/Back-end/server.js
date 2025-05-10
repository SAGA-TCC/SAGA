import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import { routerGeral } from './src/Routes/routesGeral.js'
import { routerAluno } from './src/Routes/routesAluno.js'
import { routerProf } from './src/Routes/routesProf.js'
import { routerSec } from './src/Routes/routesSec.js'

const prisma = new PrismaClient()

dotenv.config()

const PORT = process.env.PORT
export const JWT_SECRET = process.env.JWT_SECRET

const server = express()
server.use(cors())
server.timeout = 300000;
server.use(express.json())
server.use(routerGeral, routerAluno, routerProf, routerSec)

server.listen(PORT, ()=>{
    console.log("Rodando servidor!")
})
