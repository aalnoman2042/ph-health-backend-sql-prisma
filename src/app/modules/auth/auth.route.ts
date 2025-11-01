import express, { NextFunction, Request, Response } from 'express'
import { authController } from './auth.controller'


const router = express.Router()


router.post("/login",
    authController.login
    
)

export const authRoutes = router