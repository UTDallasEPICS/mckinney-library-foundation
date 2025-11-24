import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler (async (event)=>{
console.log('route reached')


const body = await readBody(event);

console.log("body:", body);

if(body.status === 'pending'){
    body.status = 0
} else{
    body.status = 1
}



try{


            
const donation = await prisma.donation.create({
data: {
    boardMemberId: body.boardMemberId,
    donorId: body.donorId,
    event: body.event,
    method: body.method,
    monetaryAmount: body.monetaryAmount,
    nonMonetaryAmount: body.nonMonetaryAmount,
    status: body.status ?? 0,
    notes: body.notes,
    receivedDate: new Date(),
    lastEditDate: new Date()
}
})


// console.log("donation,donation:", donation)

return { success: true
,statusCode: 200,data: donation,
}


}
catch(error){


console.log("error creating donation:", error)

return{success: false,statusCode: 500,message: "Failed to create donation",error: error}
};
})