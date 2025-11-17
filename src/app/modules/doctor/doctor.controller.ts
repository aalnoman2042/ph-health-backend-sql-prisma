import { Request, Response } from "express";
import pick from "../../helper/pick";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { doctorFilterableFields } from "./doctor.constant";
import { DoctorService } from "./doctor.service";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const fillters = pick(req.query, doctorFilterableFields)

    const result = await DoctorService.getAllFromDB(fillters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor fetched successfully!",
        meta: result.meta,
        data: result.data
    })
})

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;

    const result = await DoctorService.updateIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor updated successfully!",
        data: result
    })
})

const getAISuggetions = catchAsync(async(req: Request, res: Response)=>{
    
    const result = await DoctorService.getAISuggetions(req.body)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "got your suggetions successfully!",
        data: result
    }) 
})


export const doctorController ={
    getAllFromDB,updateIntoDB, getAISuggetions
}