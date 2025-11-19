import {PrismaClient} from '@prisma/client';
import {v4 as uuidv4} from 'uuid';


const prisma = new PrismaClient();
// const {sendMail} = useNodeMailer();

export default defineEventHandler(async (event) =>{
const body = await readBody(event);



console.log("body",body)

try { 

const newDonor = await prisma.donor.create({
data: {
    id: uuidv4(),
    name: body.name,
    address: body.address,
    email: body.email,
    phone: body.phone,
    preferredCommunication: body.preferredCommunication,
    notes: body.notes || null,
}
})

return("success")


}catch (err) {
return {error: err}
}   

});
