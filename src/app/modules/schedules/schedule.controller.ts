import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { scheduleService } from "./schedule.service";
import pick from "../../helper/pick";
import { IjwtPayload } from "../../types/common";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await scheduleService.insertIntoDB(req.body);
  //  console.log(req.body)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "schedule created successfully",
    data: result,
  });
});


const scheduleForDoctor =catchAsync(async (req: Request & {user?: IjwtPayload}, res: Response) => {
     const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"])
     const filter = pick(req.query , ["startDateTime", "endDateTime"])

     const user= req.user

  const result = await scheduleService.scheduleForDoctor(user as IjwtPayload, filter, options);
  //  console.log(req.body)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "schedule fetched successfully",
    data: result,
  });
});
 
const deleteScheduleFromDB = catchAsync(async(req: Request, res: Response) =>{

      const result = await scheduleService.deleteScheduleFromDB(req.params.id);
      sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "schedule deleted successfully",
    data: result,
  });
})

export const scheduleController = {
    insertIntoDB,
    scheduleForDoctor,
    deleteScheduleFromDB
}