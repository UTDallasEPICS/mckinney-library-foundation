# MPLF Donor & Grant Tracker

## Conceptual Overview

The MPLF Donor & Grant Tracker intends to provide the Foundation the ability to track their donations, donors, grants, and send mass emails to donors. Each user will have a specified role. The roles are Viewer, Editor, Admin, and Main Admin.

### Roles:

* **Viewer:** The viewer is only able to view the donations and grants pages
* **Editor:** In addition to Viewer permissions, able to  add & edit donations and grants. Can also view user roles
* **Admin:** In addition to Editor permissions, able to view the Manage Accounts page. Thus, able to un/freeze, delete, or edit users
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

### `/donations/donors`
- See all contact info
- Select one or more donors to email from within the webapp

### `/grants`
- View all the grants with their relevant data
- Sort and filter grants
- Add, edit, and delete, donations

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

* **Meta Framework:** Nuxt
* **Database:** SQLite 
* **ORM:** Prisma 
* **UI:** Tailwind CSS
* **API Testing:** Postman

## Migration Scripts

Our partner has no existing system. Therefore, we do not have to migrate any system.

## Instructions for Setting up Development Environment

### 1. Clone the repository using your terminal
```bash
git clone https://github.com/UTDallasEPICS/mckinney-library-foundation.git
```
### 2. Open the folder on Visual Studio Code
### 3. Install the dependencies
```bash
npm install
```
### 4. Set up the environment variables in the .env file
- For the Better-Auth variables, follow only step 2 in this guide: <https://www.better-auth.com/docs/installation>
- Follow steps 1-3 to be able to use the Gmail SMTP server: <https://www.geeksforgeeks.org/techtips/how-to-use-the-gmail-smtp-server-to-send-emails-for-free/#>
- - Then, modify the NUXT_NODEMAILER_EMAIL and NUXT_NODEMAILER_PASS variables in the .env file to match
- The other variables are:
```bash
DATABASE_URL="file:./mplf.db"

NUXT_NODEMAILER_HOST="smtp.gmail.com"
NUXT_NODEMAILER_PORT="587"
NUXT_NODEMAILER_FROM= 'MPLF Signin'
```
### 5. Initialize the database
```bash
npx prisma generate
npx prisma migrate dev
```
- If encountering Prisma errors, try resetting the database. This will wipe the database, so you will need to do step 8 again.
```bash
npx prisma db push --force-reset
```
### 6. Run the site locally 
```bash
npm run dev
```
### 7. Access your database on <http://localhost:5555/>
```bash
npx studio prisma
```
### 8. Create a user record and enter your email