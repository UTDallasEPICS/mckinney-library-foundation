import prisma from "~~/server/utils/prisma"
import { requireSession, filterSensitiveFields } from "~~/server/utils/requireSession"

export default defineEventHandler(async (event) => {

    const user = await requireSession(event, 0);
    try{
        const data = await prisma.grantor.findMany({
            include:{
                grants:{
                    orderBy:{
                        receivedDate: 'asc'
                    }
                },
                boardMember: true,
            }
        });
        const filtered = data.map((g) =>
            filterSensitiveFields(g, user.permission, ['email','phone','address','notes','webLink'])
        );
        return{
            success: true,
            statusCode: 200,
            data: filtered,
            error:{code: ""}
        }
    }catch(error){
        console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to get grantors",
            error: error, 
            data: null
        }
    }
});

