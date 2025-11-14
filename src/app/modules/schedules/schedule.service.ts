import { addHours, addMinutes, compareAsc, format, getMinutes } from "date-fns";
import { prisma } from "../../shared/prisma";
import { paginationHelper } from "../../helper/paginationHelper";
import { Prisma } from "@prisma/client";

const insertIntoDB = async (payload: any) => {
  const { startTime, endTime, startDate, endDate } = payload;

  console.log({payload});
  
  const intervalTime = 30;

  const schedules = [];

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );
    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );
    while (startDateTime < endDateTime) {
      const slotStartDateTime = startDateTime;
      const slotEndDateTime = addMinutes(startDateTime, intervalTime);

      const scheduleData = {
        startDateTime: slotStartDateTime,
        endDateTime: slotEndDateTime,
      };
     
      

      const existingSchedule = await prisma.schedule.findFirst({
        where: scheduleData,
      });
      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });
        schedules.push(result);
      }

      slotStartDateTime.setMinutes(slotStartDateTime.getMinutes()+ intervalTime)
    }

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return schedules;
};


const scheduleForDoctor = async (filter : any,options: any ) =>{

    const {page, limit, skip, sortBy, sortOrder} = paginationHelper.calculatePagination(options)

    const {startDateTime :filterStartDateTime, endDateTime: filterendDateTime} = filter

      const andConditions : Prisma.ScheduleWhereInput[] =[]

      if(filterStartDateTime && filterendDateTime){
        andConditions.push({
            AND:[{
                startDateTime :{
                    gte: filterStartDateTime
                }
            },
            {
                endDateTime:{
                    lte: filterendDateTime
                }
            }
        ]
        })
      }
      const whereConditon : Prisma.ScheduleWhereInput = andConditions.length > 0 ? {AND: andConditions}: {}

      const result = await prisma.schedule.findMany(
        {
            where:whereConditon,
            skip,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder
            }
        }
      )
}
export const scheduleService = {
  insertIntoDB,
  scheduleForDoctor
};
