import bcrypt from "bcrypt";

export const hashearPassword = (password:string) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hash(password, salt);
}

export const validPassword = (password:string, hashPassword:string) => {
    return bcrypt.compare(password, hashPassword)
}