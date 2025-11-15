import { prisma } from "../../shared/prisma"
import { IjwtPayload } from "../../types/common"

const insertIntoDB = async (user: IjwtPayload, payload : {
    scheduleIds : string[]
})=>{

 const doctorData = await prisma.doctor.findUniqueOrThrow({
    where:{
        email: user.email
    }
 })

 const doctorScheduleData = payload.scheduleIds.map(scheduleId=>({
    doctorId : doctorData.id,
    scheduleId
 }))

   return await prisma.doctorSchedules.createMany({
        data: doctorScheduleData
    })
 
}


export const doctorScheduleService = {
    insertIntoDB
}