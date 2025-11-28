// Import donation data from Google Sheet

// import dependencies
import  {google} from 'googleapis'
import { PrismaClient } from '@prisma/client'

// initialize prisma client
const prisma = new PrismaClient()

// interface for attributes
interface SheetRow {
    //id: string   
    //boardMemberId: string
    //donorId: string
    receivedDate: string //DateTime
    donor: string //donor
    contact: string //
    event: string
    allocatedFor: string //
    type: string //
    boardMember: string //user   
    notes: string 
    monetaryAmount: string
    method: string
    //nonMonetaryAmount: string
    // status: string //int      
    // lastEditDate: string //DateTime
}

function mapRowtoSchema (row:string[]) : SheetRow {
    return {
        receivedDate: row[0],
        donor: row[1],
        contact: row[2],
        event: row[3],
        allocatedFor: row[4],
        type: row[5],
        boardMember: row[6],
        notes: row[7],
        monetaryAmount: row[8],
        method: row[9],
    }
}

export async function importFromSheet() {
    // initialize sheetID & range
    const sheets = google.sheets({version: 'v4', auth: process.env.GOOGLE_SHEET_API_KEY })
    const sheetID = process.env.SHEET_ID;
    const range = "'donors individual'!A2:J"

    // fetch sheet rows
    const res = await sheets.spreadsheets.values.get({ spreadsheetId: sheetID, range})
    const rows = res.data.values;
    if (!rows) return console.log('No data found')

    // map sheet rows to attribute names
    try {
        for (const rawRow of rows) {
            const { receivedDate, donor, contact, event, allocatedFor, type, 
                boardMember, notes, monetaryAmount, method} = mapRowtoSchema(rawRow)

            // create donors
            const donorEntry = await prisma.donor.upsert({
                where: { name: donor },
                update: {},
                create: { name: donor, 
                        preferredCommunication: contact,
                        notes: notes,
                        firstDonationDate: receivedDate,
                        lastDonationDate: receivedDate}
            })

            // create user
            const userEntry = await prisma.user.upsert({
                where: { name: boardMember },
                update: {},
                create: { name: boardMember}
            })

            // create donations
            await prisma.donation.create({
                data: {
                    //boardMemberID
                    //donorID: donor.id,
                    boardMember: { connect: { id: userEntry.id } },
                    donor: { connect: { id: donorEntry.id } },
                    event: event,
                    method: method,
                    monetaryAmount: monetaryAmount,
                    notes: notes,
                    receivedDate: new Date(receivedDate),
                }
            })
        }
    }
    catch (error) {
        console.log(error);
    }
    // clean up and disconnect from database
    finally {() => prisma.$disconnect()}
}


