import prisma from '~~/server/utils/prisma'
import { writeAuditLog } from "~~/server/utils/auditLog";
import { requireSession } from "~~/server/utils/requireSession";


export default defineEventHandler(async (event) =>{
    try {
        const session = await requireSession(event, 3);
        const body = await readBody(event);
        const permission = Number(body.permission);
        if (!Number.isInteger(permission) || permission < 0 || permission > 3) {
            throw createError({
                statusCode: 400,
                statusMessage: "Permission level is invalid"
            });
        }
        const user = await prisma.$transaction(async (tx) => {
            const createdUser = await tx.user.create({
                data: {
                    name: body.name,
                    email: body.email,
                    permission: permission,
                },
            });

            await writeAuditLog(
                tx,
                session.user.id,
                "CREATE",
                "ACCOUNT",
                createdUser.id,
                {},
                {
                    name: createdUser.name,
                    email: createdUser.email,
                    permission: createdUser.permission,
                    status: createdUser.status,
                },
            );

            return createdUser;
        });
        return{
            success: true,
            statusCode: 200,
            data: user, 
        }
    }
    catch(error){
        console.error(error);
        if (error && typeof error === "object" && "statusCode" in error) {
            throw error;
        }
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to create user",
            error: error, 
            data: null
        }
    }
    
});
