import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";

const createPatient = catchAsync(async (req: Request, res: Response)=>{
  
    const result = await UserService.createPatient(req)
    //  console.log(req.body)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "patient created successfully",
        data: result
        
    })
})
const createAdmin = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.createAdmin(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Admin Created successfuly!",
        data: result
    })
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.createDoctor(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Doctor Created successfuly!",
        data: result
    })
});
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {

const {page, limit, searchTerm, sortBy, sortOrder} = req.query

    const result = await UserService.getAllFromDB({page: Number(page),  limit: Number(limit), searchTerm ,sortBy, sortOrder });
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "user  retrive successfuly!",
        data: result
    })
});


export const userController = {
    createPatient,
    createAdmin,
    createDoctor,

    getAllFromDB
}