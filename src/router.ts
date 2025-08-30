import { Router } from "express";
import { createUser, getUser, getUserByHandle, login, searchByHandle, updateProfile, uploadImage } from "./handlers";
import { body } from "express-validator";
import { inputValidation } from "./middleware/validation";
import { authenticate } from "./middleware/auth";

const router = Router();

/*Autenticacion*/
router.post('/auth/register',
    body('handle').isLength({ min: 3 }).withMessage('El handle debe tener al menos 3 caracteres'),
    body('name').isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    body('email').isEmail().withMessage('El email no es valido'),
    body('password').isLength({ min: 3 }).withMessage('La contraseña debe tener al menos 3 caracteres'),
    inputValidation,
    createUser)


router.post('/auth/login',
    body('email').isEmail().withMessage('El email no es valido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria '),
    inputValidation,
    login)


router.get('/user', authenticate, getUser)
router.patch('/user/',
    body('handle').isLength({ min: 3 }).withMessage('El handle debe tener al menos 3 caracteres'),

    inputValidation,
    authenticate,
    updateProfile)

router.post('/user/image', authenticate, uploadImage)

router.get('/:handle', getUserByHandle)

router.post('/search',
    body('handle').notEmpty().withMessage('El handle no puede ir vacio'),
    inputValidation,
    searchByHandle)

export default router