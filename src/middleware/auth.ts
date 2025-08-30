import { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {


    const bearer = req.headers.authorization

    if (!bearer) {
        const error = new Error('No autorizado')
        return res.status(401).json({ error: error.message })
    }

    const [, token] = bearer.split(' ') //separamos el token del bearer
    // console.log(token) //mostramos el token

    if (!token) {
        const error = new Error('No autorizado')
        return res.status(401).json({ error: error.message })
    }

    try {
        const result = jwt.verify(token, process.env.JWT_SECRET) //verificamos que sea un token valido y tenga las credenciasles
        // console.log(result)

        if (typeof result === 'object' && result.id) { //nos daa solo el ID para buscarlo
            // console.log(result.id)
            const user = await User.findById(result.id).select('-password') //buscamos el usuario
            // console.log(user)
            if (!user) { //si el usuario no existe
                const error = new Error('El usuario no existe')
                return res.status(404).json({ error: error.message })
            }

            // return res.json(user) //retornamos el usuario
            req.user = user
            next()

        }
    } catch (error) {
        res.status(500).json({ error: 'token no valido' })
    }
}