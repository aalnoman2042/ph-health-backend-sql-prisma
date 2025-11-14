import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { scheduleService } from "./schedule.service";
import pick from "../../helper/pick";

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


const scheduleForDoctor =catchAsync(async (req: Request, res: Response) => {
     const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"])
     const filter = pick(req.query , ["startDateTime", "endDateTime"])

  const result = await scheduleService.scheduleForDoctor(filter, options);
  //  console.log(req.body)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "schedule fetched successfully",
    data: result,
  });
});
 

export const scheduleController = {
    insertIntoDB,
    scheduleForDoctor
}