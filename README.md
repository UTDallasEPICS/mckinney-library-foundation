# MPLF Donor & Grant Tracker

## Conceptual Overview

The MPLF Donor & Grant Tracker intends to provide the Foundation the ability to track their donations, donors, grants, events, and send mass emails to donors and grantors. Each user will have a specified role. The roles are Viewer, Editor, Admin, and Main Admin.

### Roles:

* **Viewer:** The viewer is only able to view the donors, donations, grantors, grants, and event pages.
* **Editor:** In addition to Viewer permissions, able to add & edit donors, donations, grantors, grants, and events. The Editor can also view user roles.
* **Admin:** In addition to Editor permissions, able to view the Manage Accounts page. Thus, able to un/freeze, delete, or edit users. The Admin is also able to send mass emails to donors and grantors.
* **Main Admin:** In addition to Admin permissions, able to create accounts on the Create Accounts page

## Functional Requirements (by page)

### `/` (Login)
- If the user's email is registered, they can submit their email to recieve a one-time password (OTP) to login
- Otherwise, the user can request an account

### `/dashboard`
- Organized set of all the pages they have permission to
- Able to navigate to different pages with a click
- Displays total donations, grants, and donors

### `/donations`
- View all the donations with their relevant data
- Sort and filter donations
- Add, edit, and delete donations
- Export the data

### `/donations/donors`
- See all contact info of donors
- Select one or more donors to email from within the webapp
- Export the data

### `/grants`
- View all the grants with their relevant data
- Sort and filter grants
- Add, edit, and delete grants
- Export the data

### `/grants/grantors`
- See all contact info of grantors
- Select one or more grantors to email from within the webapp
- Export the data

### `/events`
- View all the events with their relevant data
- Sort and filter events
- Add, edit, and delete events
- Export the data

### `/settings` (user creation page)
- Create users

### `/settings/roles`
- View permissions of each role

### `/settings/accounts`
- View and manage users

## Third Party Integrations

### Better-Auth
- Creates, sends, and verifies OTP
- Manages user authentication and sessions
- Better-Auth documentation: <https://www.better-auth.com/docs/plugins/email-otp#reset-password-with-otp>

### Nodemailer with Gmail SMTP server
- Nodemailer implements the SMTP protocol to be able to send emails
- The Gmail SMTP server sends the emails directly from a Gmail account

## Tech Stacks
* **Frontend:** Vue
* **Meta Framework:** Nuxt, Typescript
* **Database:** SQLite 
* **ORM:** Prisma 
* **UI:** Tailwind CSS
* **API Testing:** Postman

## Deployment Notes

This project is currently in deployment.

Merging into the stage branch will automatically trigger an update to the stage deployment, and merging into the the main branch will automatically trigger an update to the production deployment. Make sure stage is working correctly before merging into main.

The stage branch will be taken down and you will need to request to have stage again at the start of a semester (if it is not automatically brought back up).

## Migration Scripts

Prisma migrations cannot be deleted and recreated because this project is currently in deployment.

Future Prisma migrations should be reviewed carefully. Pay attention to the SQL inside Prisma migration files to ensure there is no unintentional data loss.

## Instructions for Setting up Development Environment

### 1. Clone the repository using your terminal
```bash
git clone https://github.com/UTDallasEPICS/mckinney-library-foundation.git
```
### 2. Open the folder on Visual Studio Code
### 3. Install the dependencies
```bash
pnpm install
```
### 4. Set up the environment variables in the .env file
- Copy the .env-example file and use it as a template

- For the Better-Auth variables, follow only step 2 in this guide: <https://www.better-auth.com/docs/installation>

You can use the shared Better Auth secret provided in Discord.

- Follow steps 1-3 to be able to use the Gmail SMTP server: <https://www.geeksforgeeks.org/techtips/how-to-use-the-gmail-smtp-server-to-send-emails-for-free/#>

You do not need to create a new Gmail account. Use the shared Gmail credentials provided in Discord.

- Then, modify the NUXT_NODEMAILER_EMAIL and NUXT_NODEMAILER_PASS variables in the .env file to match
- NUXT_NODEMAILER_PORT should be set to 587 for Gmail SMTP. Other SMTP ports may cause issues when sending emails
- The other variables are:
```bash
DATABASE_URL="file:./mplf.db"

NUXT_NODEMAILER_HOST="smtp.gmail.com"
NUXT_NODEMAILER_PORT="587"
NUXT_NODEMAILER_FROM= 'MPLF Signin'
```
- Get the values for these from your mentor
### 5. Initialize the database
```bash
pnpm prisma generate
pnpm prisma migrate dev
```
### 6. Run the site locally 
```bash
pnpm run dev
```
### 7. Access your database on <http://localhost:5555/>
```bash
pnpm prisma studio
```
### 8. Create a user record on <http://localhost:5555/>
- Enter your email in the email field
- Set your permission level
- - Ranges from 0-3, where the roles are respectively: viewer, editor, admin, main admin
