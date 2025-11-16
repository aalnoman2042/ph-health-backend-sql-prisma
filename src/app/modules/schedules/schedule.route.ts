import express, { NextFunction, Request, Response } from 'express'

import { scheduleController } from './schedule.controller'
import { UserRole } from '@prisma/client'
import auth from '../../middlewares/auth'


const router = express.Router()




router.get("/",
     auth(UserRole.ADMIN, UserRole.DOCTOR),
    scheduleController.scheduleForDoctor
)
router.post("/",
    auth(UserRole.ADMIN, UserRole.DOCTOR),
    scheduleController.insertIntoDB
)
router.delete("/:id",
   
    auth(UserRole.ADMIN),
    scheduleController.deleteScheduleFromDB
)



export const scheduleRoutes = router