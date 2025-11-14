import express, { NextFunction, Request, Response } from 'express'

import { scheduleController } from './schedule.controller'


const router = express.Router()




router.get("/",
    scheduleController.scheduleForDoctor
)
router.post("/",
    // auth(UserRole.ADMIN, UserRole.DOCTOR),
    scheduleController.insertIntoDB
)



export const scheduleRoutes = router