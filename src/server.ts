import * as dotenv from "dotenv";
dotenv.config();


import express from "express";
import cors from "cors";
import router from "./router";
import { connetDB } from "./config/db";
import { corsConfig } from "./config/cors";
connetDB()

const app = express()

//configuracion de cors
app.use(cors(corsConfig))

//Leer los datos de un formulario
app.use(express.json())

app.use('/', router)


export default app