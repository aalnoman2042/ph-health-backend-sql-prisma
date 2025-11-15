import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { doctorScheduleService } from "./doctorSchedule.service";
import sendResponse from "../../shared/sendResponse";
import { IjwtPayload } from "../../types/common";

const insertIntoDB = catchAsync(async(req: Request & {user?: IjwtPayload}, res: Response) =>{


const user = req.user 

      const result = await doctorScheduleService.insertIntoDB(user as IjwtPayload, req.body);

      sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "doctor schedule created successfully",
    data: result,
  });
})

export const doctorScheduleController = {
    insertIntoDB
}