import express, { NextFunction, Request, Response } from 'express'
import { doctorScheduleController } from './doctorSchedule.controller'
import { UserRole } from '@prisma/client'
import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { DoctorScheduleValidation } from './doctorSchedule.validation'


const router = express.Router()


router.post("/",
    auth(UserRole.DOCTOR),
    validateRequest(DoctorScheduleValidation.createDoctorScheduleValidationSchema), 
    doctorScheduleController.insertIntoDB
)




export const doctorScheduleRoutes = router