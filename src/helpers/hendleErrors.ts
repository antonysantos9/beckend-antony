import { Response } from "express"
import { Prisma } from "../../generated/prisma/client"
import prismaErrorCodes from "./prismaErrorsCodes.json"

export function handleErrors(e: any, response: Response) {
    console.error(e);

    if (e instanceof Prisma.PrismaClientKnownRequestError){
        return response.status(prismaErrorCodes[e.code as keyof typeof prismaErrorCodes] || 500).json(e.message.split("\n").pop());
    }

    return response.status(500).json("o bagui ta dadando erro mn");
}