import express, { NextFunction, Request, Response } from 'express'
import { doctorScheduleController } from './doctorSchedule.controller'
import { UserRole } from '@prisma/client'
import auth from '../../middlewares/auth'


const router = express.Router()


router.post("/",
    auth(UserRole.DOCTOR),
    doctorScheduleController.insertIntoDB
)




export const doctorScheduleRoutes = router