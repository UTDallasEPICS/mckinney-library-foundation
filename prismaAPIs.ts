import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import * as dotenv from 'dotenv';
dotenv.config();  // This will explicitly load environment variables from the .env file

//console.log(process.env.DATABASE_URL); 

async function main() {
    console.log("hello");
    //await insertTuple('role_permissions', {role: 'MAIN_ADMIN', viewDonors: 1, emailDonors: 1, viewDonationsAndGrants: 1, addDonationsAndGrants: 1, viewAccounts: 1, addAccounts: 1, manageAccounts: 1, viewRoles: 1, manageRoles: 1});
    console.log(await selectTuple('role_permissions'));

    await insertTuple('contactInfo', {firstName: 'Abe', lastName: 'Lincoln', organizationName: 'United States'});
    console.log(await selectTuple('contactInfo'));

    //await insertTuple('users', {firstName: 'Main', lastName: 'Admin', role: 'MAIN_ADMIN', status: 'Active', creationDate: new Date().toISOString(), email: 'mplfboard@gmail.com', password: 'MainAdmin12345' });
    //const result = await selectTuple('users', { firstName: 'Main' });
    //console.log('Number of users:', result.count);
    //console.log('User data:', result.data);

    //await updateTuple('users', {email: 'mplfboard@gmail.com'}, {email: 'mplfBOARD@gmail.com'});
    //console.log(await selectTuple('users'));

    //await deleteTuple('users', {role: 'MAIN_ADMIN', email: 'mplfBOARD@gmail.com'});
    //console.log(await selectTuple('users'));
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