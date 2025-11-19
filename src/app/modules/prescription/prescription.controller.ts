import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
// import { IJWTPayload } from "../../types/common";
import { PrescriptionService } from "./prescription.service";
import sendResponse from "../../shared/sendResponse";
import pick from "../../helper/pick";
import httpStatus from 'http-status'
import { IjwtPayload } from "../../types/common";

const createPrescription = catchAsync(async (req: Request & { user?: IjwtPayload }, res: Response) => {
    const user = req.user;
    const result = await PrescriptionService.createPrescription(user as IjwtPayload, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "prescription created successfully!",
        data: result
    })
})

const patientPrescription = catchAsync(async (req: Request & { user?: IjwtPayload }, res: Response) => {
    const user = req.user;
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
    const result = await PrescriptionService.patientPrescription(user as IjwtPayload, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Prescription fetched successfully',
        meta: result.meta,
        data: result.data
    });
});

export const PrescriptionController = {
    createPrescription,
    patientPrescription
}