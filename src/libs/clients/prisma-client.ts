import {
    PrismaClient,
    type analysis,
    type message, 
    type motel,
    type session
} from '@prisma/client'

export const prisma = new PrismaClient()

export { analysis, message, motel, session }