import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler (async (event)=>{

    console.log("route reached")
const q = getQuery(event);
const search = q.search?.toString() || "";


// console.log("route reached")
try{
const donations = await prisma.donation.findMany({
where: search
? { // If there is query params, it'll filter 
OR: [
    {
        donor: {
            name: {
                contains: search
            }
        }
    },{
        donor: {
            phone: {
                contains: search
            }
        }
    },{
        donor: {
            email: {
                contains: search
            }
        }
    },{
        donor: {
            organization: {
                contains: search
            }
        }
    },{
        boardMember: {
            name: {
                contains: search
            }
        }
    }
]
}
: {}, // Otherwise, all donations returned 

include: {
boardMember: {
    select: {
        name: true,
    }
},

donor: {
    select: {
        name: true,
        email: true,
        phone: true,
        organization: true,
        address: true,
        lastDonationDate: true,
        firstDonationDate: true
    }
}
},
})

return{
success: true, 
donations
}
}
catch(error){
return{
success: false,
statusCode: 500,
message: "Failed to fetch donations",
error: error
}
}
})