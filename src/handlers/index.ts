import User from "../models/User";
import { Request, Response } from "express";
import slug from "slug";
import formidable from "formidable";
import { v4 as uuid } from "uuid";
import cloudinary from "../config/cloudinary";
import { hashearPassword, validPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";


export const createUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body
    try {

        const userExsit = await User.findOne({ email })
        if (userExsit) {
            const error = new Error('Este correo ya esta en uso')
            return res.status(409).json({ error: error.message })
        }


        const handle = slug(req.body.handle)
        const handleExist = await User.findOne({ handle })
        if (handleExist) {
            const error = new Error('El handle ya esta en uso')
            return res.status(409).json({ error: error.message })
        }


        const contrasena = await hashearPassword(password)
        const user = new User({
            handle,
            name,
            email,
            password: contrasena
        })
        await user.save()
        res.status(201).send('Usuario creado correctamente')


    } catch (error) {
        console.log(error)
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) {
            const error = new Error('El usuario no existe')
            return res.status(404).json({ error: error.message })
        }

        const compararPassword = await validPassword(password, user.password)

        if (!compararPassword) {
            const error = new Error('La contraseña es incorrecta')
            return res.status(403).json({ error: error.message })
        }

        const token = generateJWT({ id: user._id })

        res.status(200).json(token)
    } catch (error) {
        console.log(error)
    }


}


export const getUser = async (req: Request, res: Response) => {
    // console.log("Desde getUser")
    res.json(req.user)
}

export const updateProfile = async (req: Request, res: Response) => {

    try {
        const { description, links } = req.body

        const handle = slug(req.body.handle, '-')
        const handleExist = await User.findOne({ handle })

        if (handleExist && handleExist.email !== req.user.email) {
            const error = new Error('El handle ya esta en uso')
            return res.status(409).json({ error: error.message })
        }

        //actualizamos el usuario
        req.user.description = description
        req.user.handle = handle
        req.user.links = links

        await req.user.save()
        res.send('Perfil actualizado correctamente')

    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(500).json({ error: error.message })
    }

}

export const uploadImage = async (req: Request, res: Response) => {

    const form = formidable({ multiples: false })

    try {
        form.parse(req, (error, fields, files) => {
            // console.log(files.file[0].filepath) ubicamos la imagen

            cloudinary.uploader.upload(files.file[0].filepath, {public_id:uuid() }, async function(error, result){

                if(error) {
                    const error = new Error('Hubo un error al subir la imagen')
                    return res.status(500).json({ error: error.message })
                }

                if(result){
                    // console.log(result.secure_url) //mostramos la url de la imagen
                    req.user.image = result.secure_url
                    await req.user.save()
                    return res.json({image: result.secure_url})
                }
                

            })
        })

    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(500).json({ error: error.message })
    }

}


export const getUserByHandle = async (req: Request, res: Response) => { 

    try {
        const { handle } = req.params

        const user = await User.findOne({ handle }).select('-password -_id -__v -email')
        if (!user) {
            const error = new Error('El usuario no existe')
            return res.status(404).json({ error: error.message })
        }
        res.json(user)
        
        
    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(500).json({ error: error.message })
    }

}


export const searchByHandle = async (req: Request, res: Response) => { 

    try {
        const { handle } = req.body

        const userExist = await User.findOne({handle})
        if(userExist){
            const error = new Error(`${handle} ya esta en uso`)
            return res.status(409).json({ error: error.message })
        }
        res.send(`${handle} esta disponible`)
        
    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(500).json({ error: error.message })
    }

}
