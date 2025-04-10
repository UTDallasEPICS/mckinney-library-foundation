import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import * as dotenv from 'dotenv';
dotenv.config();  // This will explicitly load environment variables from the .env file

//console.log(process.env.DATABASE_URL); 

async function main() {

    /**
    await deleteTuple('contactInfo');
    await deleteTuple('users');
    await deleteTuple('donations');
    await deleteTuple('donors');
    await deleteTuple('grants');
    await deleteTuple('rolePermissions');
     */

    /**
     * Contact Info
     */
    const contact1 = await insertTuple('contactInfo', {firstName: 'George', lastName: 'Washington', email: 'gwashthefirst@gmail.com'});
    const contact2 = await insertTuple('contactInfo', {firstName: 'Abe', lastName: 'Lincoln', email: 'honestabe@gmail.com'});
    const contact3 = await insertTuple('contactInfo', {firstName: 'Mark', lastName: 'Grayson', phoneNumber: 9728422948});
    const contact4 = await insertTuple('contactInfo', {firstName: 'Peter', lastName: 'Parker', organizationName: 'Parker Industries'});
    const contact5 = await insertTuple('contactInfo', {firstName: 'Bruce', lastName: 'Wayne', address: '123 Wayne Manor'});
    const contact6 = await insertTuple('contactInfo', {firstName: 'Natasha', lastName: 'Romanoff', phoneNumber: 2147628938, email: 'widow@hotmail.com'});
    const contact7 = await insertTuple('contactInfo', {firstName: 'John', lastName: 'Wick', notes: 'He is one wicked fella'});
    const contact8 = await insertTuple('contactInfo', {firstName: 'Harvey', lastName: 'Specter', organizationName: 'Pearson Specter LLC', email: 'harvey.specter@pearsonspecter.com'});
    const contact9 = await insertTuple('contactInfo', {firstName: 'Jimmy', lastName: 'Fallon', email: 'fallon@gmail.com', notes: 'he has a great ice cream!'});
    const contact10 = await insertTuple('contactInfo', {firstName: 'Clark', lastName: 'Kent', phoneNumber: 4697362918, email: 'superman@dailyplanet.com'});
    const contact11 = await insertTuple('contactInfo', {firstName: 'UTD', lastName: 'Temoc', phoneNumber: 1234567890, notes: 'he is temoc lol'});
    const contact12 = await insertTuple('contactInfo', {firstName: 'Lionel', lastName: 'Messi', organizationName: 'Soccer/Football', notes: 'G.O.A.T.'});
    const contact13 = await insertTuple('contactInfo', {firstName: 'Wanda', lastName: 'Maximoff'});
    const contact14 = await insertTuple('contactInfo', {notes: 'anonymous'});
    const contact15 = await insertTuple('contactInfo', {firstName: 'Samantha', lastName: 'Wilkins', notes: 'atom eve' , phoneNumber: 2147549890, address: '123 right next door st.', organizationName: 'Invincible Inc.', email: 'atomeve@hotmail.com'});
    const contact16 = await insertTuple('contactInfo', {firstName: 'Sue', lastName: 'Storm', organizationName: 'The Fantastic Four', email: 'invisiblewoman@gmail.com'});
    const contact17 = await insertTuple('contactInfo', {firstName: 'Roben', lastName: 'Closs', organizationName: 'MPLF', email: 'mplfboard@gmail.com'});
    const contact18 = await insertTuple('contactInfo', {firstName: 'Joe', lastName: 'Closs', organizationName: 'MPLF', email: 'mplfboard@gmail.com'});
    const contact19 = await insertTuple('contactInfo', {firstName: 'Jonathan', lastName: 'Xu', organizationName: 'EPICS', email: 'personalemailhere'});
    const contact20 = await insertTuple('contactInfo', {firstName: 'Carlos', lastName: 'Valeriano', organizationName: 'EPICS', email: 'personalemailhere'});
    const contact21 = await insertTuple('contactInfo', {firstName: 'Janet', lastName: 'Bui', organizationName: 'EPICS', email: 'personalemailhere'});
    const contact22 = await insertTuple('contactInfo', {firstName: 'Arjun', lastName: 'Kaimal', organizationName: 'EPICS', email: 'personalemailhere'});
    const contact23 = await insertTuple('contactInfo', {firstName: 'Nihal', lastName: 'Paul', organizationName: 'EPICS', email: 'personalemailhere'});
    const contact24 = await insertTuple('contactInfo', {firstName: 'Karthik', lastName: 'Bhagavatula', organizationName: 'EPICS', email: 'personalemailhere'});

    //const contactInfo = await selectTuple('contactInfo');
    //console.log(contactInfo);

    /**
     * Role Permissions
     */
    await insertTuple('rolePermissions', {role: 'MAIN_ADMIN', viewDonors: 1, emailDonors: 1, viewDonationsAndGrants: 1, addDonationsAndGrants: 1, viewAccounts: 1, addAccounts: 1, manageAccounts: 1, viewRoles: 1, manageRoles: 1});
    await insertTuple('rolePermissions', {role: 'ADMIN', viewDonors: 1, emailDonors: 1, viewDonationsAndGrants: 1, addDonationsAndGrants: 1, viewAccounts: 1, addAccounts: 1, manageAccounts: 0, viewRoles: 1, manageRoles: 0});
    await insertTuple('rolePermissions', {role: 'EDITOR', viewDonors: 1, emailDonors: 1, viewDonationsAndGrants: 1, addDonationsAndGrants: 1, viewAccounts: 1, addAccounts: 0, manageAccounts: 0, viewRoles: 0, manageRoles: 0});
    await insertTuple('rolePermissions', {role: 'FINANCE_VIEW_ONLY', viewDonors: 1, emailDonors: 0, viewDonationsAndGrants: 1, addDonationsAndGrants: 0, viewAccounts: 0, addAccounts: 0, manageAccounts: 0, viewRoles: 0, manageRoles: 0});
    await insertTuple('rolePermissions', {role: 'FUNDRAISING', viewDonors: 1, emailDonors: 0, viewDonationsAndGrants: 1, addDonationsAndGrants: 0, viewAccounts: 0, addAccounts: 0, manageAccounts: 0, viewRoles: 0, manageRoles: 0});
    //const rolePermissions = await selectTuple('rolePermissions');
    //console.log(rolePermissions);

    /**
     * Users
     */ /**
    await insertTuple('users', { contactInfoID: contact1.contactInfoID, role: 'MAIN_ADMIN', status: 'Active', password: 'georgeyboy101'});
    await insertTuple('users', { contactInfoID: contact2.contactInfoID, role: 'EDITOR', status: 'Active', password: 'letthetruthbetold' });
    await insertTuple('users', { contactInfoID: contact4.contactInfoID, role: 'ADMIN', status: 'Active', password: 'spidey123', creationDate: '10/20/2004'});
    await insertTuple('users', { contactInfoID: contact5.contactInfoID, role: 'EDITOR', status: 'Active', password: 'iamvengeance'});
    await insertTuple('users', { contactInfoID: contact8.contactInfoID, role: 'ADMIN', status: 'Active', password: 'iamharveyspecter', notes:'not to be 100% trusted'});
    await insertTuple('users', { contactInfoID: contact10.contactInfoID, role: 'FUNDRAISING', status: 'Active', password: 'supessupessupes', creationDate: '01/01/1998'});
    await insertTuple('users', { contactInfoID: contact11.contactInfoID, role: 'FINANCE_VIEW_ONLY', status: 'Active', password: 'UTDspirit101'});
    await insertTuple('users', { contactInfoID: contact13.contactInfoID, role: 'FINANCE_VIEW_ONLY', status: 'Active', password: 'scarletwitch', creationDate: '03/05/2001'});
    await insertTuple('users', { contactInfoID: contact15.contactInfoID, role: 'ADMIN', status: 'Active', password: 'atomeve<3'});
    await insertTuple('users', { contactInfoID: contact16.contactInfoID, role: 'FUNDRAISING', status: 'Active', password: 'FamilyOfFour', creationDate: '01/01/1980', notes: 'we are all a family here'});
    //const users = await selectTuple('users');
    //console.log(users);
    

    /**
     * Donors
     */ /**
    const donor1 = await insertTuple('donors', {contactInfoID: contact1.contactInfoID, lastContacted: '01/01/2003', lifetimeDonations: 100000});
    const donor2 = await insertTuple('donors', {contactInfoID: contact2.contactInfoID, lastContacted: '03/13/2025', lifetimeDonations: 2500});
    const donor3 = await insertTuple('donors', {contactInfoID: contact4.contactInfoID, lastContacted: '03/13/2021', lifetimeDonations: 500, firstDonationDate: '01/04/2020'});
    const donor4 = await insertTuple('donors', {contactInfoID: contact5.contactInfoID, lastContacted: '07/26/2020', lifetimeDonations: 3500, firstDonationDate: '01/05/2019', lastDonationDate: '07/25/2020'});
    const donor5 = await insertTuple('donors', {contactInfoID: contact7.contactInfoID, lastContacted: '09/29/2024', lifetimeDonations: 1230, firstDonationDate: '02/08/2019', lastDonationDate: '09/20/2024'});
    const donor6 = await insertTuple('donors', {contactInfoID: contact9.contactInfoID, lastContacted: '01/01/2013', lifetimeDonations: 6700, notes: 'first donation'});
    const donor7 = await insertTuple('donors', {contactInfoID: contact10.contactInfoID, lastContacted: '05/17/2015', lifetimeDonations: 840});
    const donor8 = await insertTuple('donors', {contactInfoID: contact12.contactInfoID, lastContacted: '08/18/2022', lifetimeDonations: 580, firstDonationDate: '01/17/2020'});
    const donor9 = await insertTuple('donors', {contactInfoID: contact13.contactInfoID, lastContacted: '11/13/2018', lifetimeDonations: 6200, firstDonationDate: '04/01/2020', lastDonationDate: '07/25/2020'});
    const donor10 = await insertTuple('donors', {contactInfoID: contact15.contactInfoID, lastContacted: '12/30/2022', lifetimeDonations: 1590, firstDonationDate: '02/08/2019', lastDonationDate: '09/20/2024', notes: 'cool donor!'});
    //const donors = await selectTuple('donors');
    //console.log(donors);


    /**
     * Donations
     */ /**
    await insertTuple('donations', {donorID: donor1.donorID, value: 100000, donationMethod: 'Check', allocatedFor: 'Fundraiser', notes: 'biggest donation in mplf history'});
    await insertTuple('donations', {donorID: donor2.donorID, value: 2500, donationMethod: 'GiveButter', allocatedFor: 'Autumn Event'});
    await insertTuple('donations', {donorID: donor3.donorID, value: 250, donationMethod: 'PayPal', allocatedFor: 'Fundraiser', date: '01/04/2020'});
    await insertTuple('donations', {donorID: donor3.donorID, value: 250, donationMethod: 'GiveButter', allocatedFor: 'Walk-In'});
    await insertTuple('donations', {donorID: donor4.donorID, value: 2000, donationMethod: 'PayPal', allocatedFor: 'Fundraiser', date: '01/05/2019'});
    await insertTuple('donations', {donorID: donor4.donorID, value: 1500, donationMethod: 'Check', allocatedFor: 'Winter Event', date: '07/25/2020'});
    await insertTuple('donations', {donorID: donor5.donorID, value: 1000, donationMethod: 'Check', allocatedFor: 'Fundraiser', date: '02/08/2019'});
    await insertTuple('donations', {donorID: donor5.donorID, value: 230, donationMethod: 'GiveButter', allocatedFor: 'Book Donation Event', date: '09/20/2024'});
    await insertTuple('donations', {donorID: donor6.donorID, value: 6700, donationMethod: 'Check', allocatedFor: 'Fundraiser'});
    await insertTuple('donations', {donorID: donor7.donorID, value: 840, donationMethod: 'PayPal', allocatedFor: 'Winter Event'});
    await insertTuple('donations', {donorID: donor8.donorID, value: 200, donationMethod: 'Check', allocatedFor: 'Book Donation Event', date: '01/17/2020'});
    await insertTuple('donations', {donorID: donor8.donorID, value: 380, donationMethod: 'PayPal', allocatedFor: 'Library Event'});
    await insertTuple('donations', {donorID: donor9.donorID, value: 3000, donationMethod: 'Check', allocatedFor: 'Walk-In', date: '04/01/2020'});
    await insertTuple('donations', {donorID: donor9.donorID, value: 3200, donationMethod: 'PayPal', allocatedFor: 'Local Event', date: '07/25/2020'});
    await insertTuple('donations', {donorID: donor10.donorID, value: 200, donationMethod: 'GiveButter', allocatedFor: 'Fundraiser', date: '02/08/2019'});
    await insertTuple('donations', {donorID: donor10.donorID, value: 1390, donationMethod: 'PayPal', allocatedFor: 'Fall Event', date: '09/20/2024'});
    //const donations = await selectTuple('donations');
    //console.log(donations);


    /**
     * Grants
     */ /**
    await insertTuple('grants', {contactInfoID: contact1.contactInfoID, value: 3500, allocatedFor: 'Fundraisers', date: '01/01/2020'});
    await insertTuple('grants', {contactInfoID: contact2.contactInfoID, value: 4000, allocatedFor: 'Events', date: '12/25/2018'});
    await insertTuple('grants', {contactInfoID: contact5.contactInfoID, value: 250000, allocatedFor: 'Renovations', notes: "Bruce Wayne's foundation!"});
    await insertTuple('grants', {contactInfoID: contact10.contactInfoID, value: 5000, allocatedFor: 'Book Donations', date: '03/20/2025'});
    await insertTuple('grants', {contactInfoID: contact13.contactInfoID, value: 2000, allocatedFor: 'Giveaways', date: '08/16/2022'});
    //const grants = await selectTuple('grants');
    //console.log(grants);
    

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
/**async function insertTuple<T extends keyof PrismaClient>(
    table: T,
    data: Prisma.Args<PrismaClient[T], 'create'>['data']       //ensures that "data" matches the structure of the table
) {
    return await (prisma[table] as any).create({data});
}*/

async function insertTuple<T extends keyof PrismaClient>(
    table: T,
    data: Prisma.Args<PrismaClient[T], 'create'>['data']
) {
    try {
        const result = await (prisma[table] as any).create({ data });
        console.log(`✅ Successfully inserted:`, result);
        return result;
    } catch (error) {
        console.error(`❌ Error inserting:`, error);
    }
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