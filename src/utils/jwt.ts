import jwt, {JwtPayload} from "jsonwebtoken";

export const generateJWT = (payload: JwtPayload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
    return token
}