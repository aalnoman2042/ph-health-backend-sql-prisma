import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AppointmentService } from "./appointment.service";
import sendResponse from "../../shared/sendResponse";
import { IjwtPayload } from "../../types/common";
// import { IJWTPayload } from "../../types/common";


const createAppointment = catchAsync(async (req: Request & { user?: IjwtPayload }, res: Response) => {
    const user = req.user; 
    const result = await AppointmentService.createAppointment(user as IjwtPayload, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Appointment created successfully!",
        data: result
    })
});

export const AppointmentController = {
    createAppointment,
}