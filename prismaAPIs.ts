import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import * as dotenv from 'dotenv';
dotenv.config();  // This will explicitly load environment variables from the .env file

//console.log(process.env.DATABASE_URL); 

async function main() {

    /**
     * Contact Info and Users
     */
    const contact1 = await insertTuple('contactInfo', {firstName: 'George', lastName: 'Washington', email: 'gwashthefirst@gmail.com'});
    await insertTuple('users', { contactInfoID: contact1.contactInfoID, role: 'MAIN_ADMIN', status: 'Active', creationDate: new Date().toISOString(), password: 'georgeyboy101' });
    const result1 = await selectTuple('users');

    const contact2 = await insertTuple('contactInfo', {firstName: 'Abe', lastName: 'Lincoln', email: 'honestabe@gmail.com'});
    await insertTuple('users', { contactInfoID: contact2.contactInfoID, role: 'ADMIN', status: 'Active', creationDate: new Date().toISOString(), password: 'letthetruthbetold' });
    const result = await selectTuple('users');

    /**
     * Donations
     */
    await insertTuple('donations', {value: 10000, donationMethod: 'Check',allocatedFor: 'Fundraiser'});
    console.log(await selectTuple('donations'));
    
    await insertTuple('donations', {value: 3200, donationMethod: 'GiveButter', allocatedFor: 'Library Event'});
    console.log(await selectTuple('donations'));


    /**
     * Donors
     */
    await insertTuple('donors', {contactInfoID: contact1.contactInfoID, lastContacted: '01/01/2003', lifetimeDonations: 100000});
    console.log(await selectTuple('donors'));

    await insertTuple('donors', {contactInfoID: contact2.contactInfoID, lastContacted: '03/13/2025', lifetimeDonations: 2500});
    console.log(await selectTuple('donors'));

    /**
     * Grants
     */
    await insertTuple('grants', {contactInfoID: contact1.contactInfoID, value: 4000, allocatedFor: 'Fundraiser'});
    console.log(await selectTuple('grants'));

    await insertTuple('grants', {contactInfoID: contact2.contactInfoID, value: 7500, allocatedFor: 'Event'});
    console.log(await selectTuple('grants'));

    /**
     * Role Permissions
     */
    await insertTuple('rolePermissions', {role: 'MAIN_ADMIN', viewDonors: 1, emailDonors: 1, viewDonationsAndGrants: 1, addDonationsAndGrants: 1, viewAccounts: 1, addAccounts: 1, manageAccounts: 1, viewRoles: 1, manageRoles: 1});
    console.log(await selectTuple('rolePermissions'));

    await insertTuple('rolePermissions', {role: 'EDITOR', viewDonors: 1, emailDonors: 1, viewDonationsAndGrants: 1, addDonationsAndGrants: 1, viewAccounts: 1, addAccounts: 0, manageAccounts: 0, viewRoles: 0, manageRoles: 0});
    console.log(await selectTuple('rolePermissions'));

    

    //console.log('Number of users:', result.count);
    //console.log('User data:', result.data);

    /**
    await updateTuple('users', {password: 'MainAdmin12345'}, {password: 'password123'});
    console.log(await selectTuple('users'));

    await deleteTuple('users', {role: 'MAIN_ADMIN', email: 'mplfBOARD@gmail.com'});
    console.log(await selectTuple('users'));
     */
}

main();

//T is a generic type that represents the name of a table
//keyof PrismaClient makes sure that T is the name of a table from the Prisma schema
async function insertTuple<T extends keyof PrismaClient>(
    table: T,
    data: Prisma.Args<PrismaClient[T], 'create'>['data']       //ensures that "data" matches the structure of the table
) {
    return await (prisma[table] as any).create({data});
}

async function updateTuple<T extends keyof PrismaClient>(
    table: T,
    where: Prisma.Args<PrismaClient[T], 'update'>['where'],    //specifies what tuples to update
    data: Prisma.Args<PrismaClient[T], 'update'>['data']       //gives new values to the tuples
) {
    return await (prisma[table] as any).update({where, data});
}

async function deleteTuple<T extends keyof PrismaClient>(
    table: T, 
    where?: Prisma.Args<PrismaClient[T], 'delete'>['where']     //the "where" argument is optional. If you don't include
  ) {                                                           //a "where" argument, deleteTuple() will delete all tuples
    return await (prisma[table] as any).delete({where});        //from the table
}

async function selectTuple<T extends keyof PrismaClient>(
    table: T,
    where?: Prisma.Args<PrismaClient[T], 'findMany'>['where']       //the "where" argument is optional. If you don't include
  ) {                                                               //a "where" argument, selectTuple() will select all tuples
    //return await (prisma[table] as any).findMany({where});        //from the table
    const results = await (prisma[table] as any).findMany({where});
    return { count: results.length, data: results };
}

//selectTuple() returns both the tuples themselves and the number of tuples selected