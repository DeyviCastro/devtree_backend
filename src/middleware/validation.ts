import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";

export const inputValidation = (req:Request, res:Response, next:NextFunction) => {

    const resultado = validationResult(req)
    if (!resultado.isEmpty()) {
        return res.status(400).json({ error: resultado.array() })
    }
    next()

}