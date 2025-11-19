import { AppointmentStatus, paymentStatus, Prescription, UserRole } from "@prisma/client";
// import { IJWTPayload } from "../../types/common";
import { prisma } from "../../shared/prisma";
// import ApiError from "../../errors/ApiError";
import httpStatus from 'http-status'
import {  paginationHelper } from "../../helper/paginationHelper";
import { IjwtPayload } from "../../types/common";
import ApiError from "../../Errors/ApiError";

const createPrescription = async (user: IjwtPayload, payload: Partial<Prescription>) => {
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
            status: AppointmentStatus.COMPLETED,
            paymentStatus: paymentStatus.PAID
        },
        include: {
            doctor: true
        }
    })

    if (user.role === UserRole.DOCTOR) {
        if (!(user.email === appointmentData.doctor.email))
            throw new ApiError(httpStatus.BAD_REQUEST, "This is not your appointment")
    }

    const result = await prisma.prescription.create({
        data: {
            appointmentId: appointmentData.id,
            doctorId: appointmentData.doctorId,
            patientId: appointmentData.patientId,
            instructions: payload.instructions as string,
            followUpDate: payload.followUpDate || null
        },
        include: {
            patient: true
        }
    });

    return result;
}

const patientPrescription = async (user: IjwtPayload, options: any) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);

    const result = await prisma.prescription.findMany({
        where: {
            patient: {
                email: user.email
            }
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            doctor: true,
            patient: true,
            appointment: true
        }
    })

    const total = await prisma.prescription.count({
        where: {
            patient: {
                email: user.email
            }
        }
    })

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }

};


export const PrescriptionService = {
    createPrescription,
    patientPrescription
}