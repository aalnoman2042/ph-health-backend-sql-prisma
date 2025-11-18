import { Doctor, Prisma } from "@prisma/client";
import { IOPtions, paginationHelper } from "../../helper/paginationHelper";
import { doctorSearchableFields } from "./doctor.constant";
import { object } from "zod";
import { prisma } from "../../shared/prisma";
import { IDoctorUpdateInput } from "./doctor.interface";
import ApiError from "../../Errors/ApiError";
import httpStatus from "http-status";
import { openai } from "../../helper/open-router";
import { extractJsonFromMessage } from "../../helper/extractJsonFromMessage";

const getAllFromDB = async (filters: any, options: IOPtions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, specialties, ...filterData } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];
  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
console.log(specialties);

 if (specialties && specialties.length > 0) {
        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialities: {
                        title: {
                            contains: specialties,
                            mode: "insensitive"
                        }
                    }
                }
            }
        })
    }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));

    andConditions.push(...filterConditions);
  }

  const whereCondition: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
        doctorSpecialties:{
            include:{
                specialities: true
            }
        }
    }
  });

  const total = await prisma.doctor.count({
    where: whereCondition,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const updateIntoDB = async (
  id: string,
  payload: Partial<IDoctorUpdateInput>
) => {
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  const { specialities, ...doctorData } = payload;
  return await prisma.$transaction(async (tnx) => {
    if (specialities && specialities.length > 0) {
      const deleteSpecialtyIds = specialities.filter(
        (speciality) => speciality.isDeleted
      );

      for (const speciality of deleteSpecialtyIds) {
        await tnx.doctorSpecialties.deleteMany({
          where: {
            doctorId: id,
            specialitiesId: speciality.specialityId,
          },
        });
      }

      const createSpecialityIds = specialities.filter(
        (specialty) => !specialty.isDeleted
      );

      for (const specialty of createSpecialityIds) {
        await tnx.doctorSpecialties.create({
          data: {
            doctorId: id,
            specialitiesId: specialty.specialityId,
          },
        });
      }
    }

    const updatedData = await tnx.doctor.update({
      where: {
        id: doctorInfo.id,
      },
      data: doctorData,
      include: {
        doctorSpecialties: {
          include: {
            specialities: true,
          },
        },
      },
    });
    return updatedData;
  });
};

const getAISuggetions = async(payload: {symptom : string})=>{
if(!(payload && payload.symptom)){
throw new ApiError(httpStatus.BAD_REQUEST, "symptom is required")
}

const doctors = await prisma.doctor.findMany({
  where : {isDeleted: false},
  include:{
    doctorSpecialties:{
      include:{
        specialities: true
      }
    }
  }
})

    const prompt = `
You are an AI medical assistant for an online doctor appointment platform.

Your task:
- Analyze the patient's symptoms.
- Compare symptoms with each doctor's specialties.
- Select ONLY the doctors whose specialties are relevant to the symptoms.
- Rank the top 3 most suitable doctors (or fewer if less available).
- If NO doctor's specialty matches the symptoms, return a "noDoctorFound": true response.

Important Rules:
1. Do NOT guess specialties.
2. Do NOT include unrelated doctors.
3. If there is only ONE doctor available, still evaluate relevance strictly.
4. Matching should be based on SPECIALTY TITLE relevance to symptoms (e.g., chest pain → cardiology, fever → medicine, skin rash → dermatology).

Here is the doctor list (in JSON):
${JSON.stringify(doctors, null, 2)}

Input:
Symptoms: ${payload.symptom} 
`;

    console.log("analyzing......\n")
    const completion = await openai.chat.completions.create({
        model: 'z-ai/glm-4.5-air:free',
        messages: [
            {
                role: "system",
                content:
                    "You are a helpful AI medical assistant that provides doctor suggestions.",
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
    });
    const result = await extractJsonFromMessage(completion.choices[0].message)
    return result;
    
}

const getByIdFromDB = async (id: string): Promise<Doctor | null> => {
    const result = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true,
                },
            },
            doctorSchedules: {
                include: {
                    schedule: true
                }
            }
        },
    });
    return result;
};

export const DoctorService = {
  getAllFromDB,
  updateIntoDB,
  getAISuggetions,
  getByIdFromDB,
};
