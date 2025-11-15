import { UserRole } from "@prisma/client"

export type IjwtPayload ={
    email : string,
    role: UserRole
}