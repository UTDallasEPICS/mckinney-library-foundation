import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaClientInitializationError } from "@prisma/client/runtime/library";

import { randomInt } from "crypto";

export default defineEventHandler(async (event) => { 


    const prisma = new PrismaClient()

try {
    const newAccount = await prisma.user.create({

        data: {                     //all of this is hardcoded for now testing purposes
            id: randomInt(1000000, 9999999).toString(),
            name: "efrain",
            email: "efrain.arevalo@gmail.com", 
            permission: 1
        }
    })
}

catch { 

        return {error: PrismaClientInitializationError}

}


});