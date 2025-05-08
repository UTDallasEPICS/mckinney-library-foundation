# MPLF Donor & Grant Tracker

## Conceptual Overview

The MPLF Donor & Grant Tracker intends to provide the Foundation the ability to track their donations, donors, grants, and send mass emails to donors as well. The different pages consist of the Login, Dashboard, View Donations, Add Donation, View Donors, View Grants, Add Grant, Create Account, View Roles, and Manage Accounts. The site will also have different roles for the user depending on what permissions the Foundation wants for them. The roles are Viewer, Editor, Admin, and Main Admin.

### A broad overview of each page:

* **Login:** Login to site and request invitation for new users. (This page will change as EPICS wants us to change to Auth0 but has not let us know more about it.)
* **Dashboard:** The ability to navigate to any other page directly.
* **View Donations:** View info about all donations.
* **Add Donation:** Add a donation and related donor info to the site/database.
* **View Donors:** View donor info and mass email donors.
* **View Grants:** View info about all grants.
* **Add Grant:** Add a grant to the site/database.
* **Create Account:** Create an account for new users directly rather than from the login screen.
* **View Roles:** View the permissions that each role has.
* **Manage Accounts:** View all accounts and their roles. Able to change user’s roles, freeze, unfreeze, and delete accounts.

### A broad overview of each role:

* **Viewer:** Able to view the site except for the Settings pages.
* **Editor:** In addition to Viewer permissions, able to edit the Donations and Grants pages and view the Settings pages.
* **Admin:** In addition to Editor permissions, able to edit the Manage Accounts page.
* **Main Admin:** In addition to Admin permissions, able to create accounts on the Create Accounts page.

## Functional Requirements

### Header

* **Location**
    * Header is displayed at the top of every page
* **Layout**
    * MPLF logo on left-hand side of the header
    * Link to MPLF website on right-hand side
    * Log out button is to the right of the website link

### Navbar

* **Location**
    * Navbar is displayed below the header on every page except the Dashboard
* **Layout**
    * Navbar is split into two parts
    * The top part has four sections, from left to right
        * Dashboard
        * Donations
        * Grants
        * Settings
    * When you click on one of the four sections, the background of the selected section in the navbar turns dark blue, and the text of the selected section turns white
    * When you click on a different section, the background of the original section turns white, and the text of the original section turns dark blue
    * Bottom part is different for each of the four sections
        * Dashboard has no bottom part because the navbar disappears entirely when you’re on the Dashboard
        * Donations has three pages, from left to right
            * View Donations
                * Default landing page when you click on the Donations section in the top part of the navbar
            * Add Donations
            * View Donors
        * Grants has two pages
            * View Grants
                * Default landing page when you click on the Grants section in the top part of the navbar
            * Add Grants
        * Settings has three pages
            * Create Account
                * Default landing page when you click on the Settings section in the top part of the navbar
            * View Roles
            * Manage Accounts

### Login Page

* **Layout**
    * A centered login box on a light blue background
    * The login form is placed inside a white rounded box
    * A “Welcome!” greeting and a short instruction (“Please sign in to continue”) on top
    * **Email Field:**
        * Input type: email
        * Must follow a valid email format (must include “@” and a domain)
        * Required for submission
        * On error: Show “Please enter a valid email address (example@domain.com).”
    * **Password Field:**
        * Input type: password
        * Must be 8-20 characters long
        * Must include:
            * At least one uppercase letter
            * At least one lowercase letter
            * At least one number
        * Input is masked for privacy
        * Required for submission
        * On error: Show “Password must be 8-29 characters long, include an uppercase letter, a lowercase letter, and a number.”
    * **“Remember me” Checkbox:**
        * User can select this checkbox to indicate they want their login remembered
    * **“Forgot password?” Link:**
        * On click, an automated email is sent to the user
        * The email includes:
            * Instructions to reset their password
            * The link to reset their password
    * **“Sign In” button:**
        * Correct login: Clicking “Sign in” redirects to the Dashboard.
        * Incorrect login: Clicking “Sign In” displays error messages.
    * **“or Request an Invitation” Link:**
        * On click, an automated request email is sent to MPLFBoard@gmail.com (Main Admin)
        * The email includes:
            * The requesting user’s information
            * A link leads to the Create New Account for the Main Admin to create a new account for a user.

### Dashboard

* **Layout**
    * Title: Centered at the top “MPLF Donor & Grant Tracker Dashboard”
    * Three main sections: Donations, Grants, and Settings.
    * **Donations Section:**
        * View Donations: Button that redirects to the View Donations page.
        * Add Donation: Button that redirects to the Add Donation page.
        * View Donors: Button that redirects to the View Donors page.
    * **Grants Section:**
        * View Grants: Button that redirects to the View Grants page.
        * Add Grants: Button that redirects to the Add Grants page.
    * **Settings:**
        * Create Account: Button that redirects to the Create Account page.
        * View Roles: Button that redirects to the View Roles page.
        * Manage Accounts: Button that redirects to the Manage Accounts page.

### View Donations

* **Layout**
    * Top of the page contains multiple filter fields for narrowing down donations:
        * Donor name (text input)
        * Donation Date (start and end date filters)
        * Amount Range (minimum and maximum inputs)
        * Type (dropdown menu: Monetary, In-Kind, etc.)
        * Source (dropdown: e.g., Event, Website, Mail)
        * Submit button to apply filters
        * Each filter field has an “X” button to clear input
    * Bottom of the page displays a table listing donation records
        * Displays even if no donations are returned
        * Table scrolls horizontally if content overflows
    * **Table Columns:**
        * Donor Name
        * Donor Type
        * Donation Amount (formatted with $ and two decimals)
        * Source
        * Donation Date
        * Notes (shows PDF icon if file is attached)
        * Actions (Edit and Delete buttons)
* **Edit Donation Modal**
    * Title: “Edit Donation”
    * **Fields:**
        * Donor (select existing or add new)
        * Amount
        * Type
        * Source
        * Donation Date
        * Notes (file input)
    * Buttons: Green “Update” and Gray “Cancel”
* **Delete Donation Modal**
    * Confirms deletion with donor name
    * Red “Delete” and Gray “Cancel” buttons

### Add Donation

* **Layout**
    * Title “Add New Donation”
    * Light blue background form with the following fields:
        * Donor (dropdown with option to add new)
        * Donation Amount (required, non-negative)
        * Donation Type (dropdown: Monetary, In-Kind, etc.)
        * Source (dropdown or text input)
        * Donation Date (required)
        * Notes (file input, optional)
* **Validation**
    * Amount must be >= $0
    * Donation Date must be valid
    * Donor field must be filled
    * Optional fields like Notes can be blank
* On submission, data is added to the donations database.

### View Donors

* **Layout**
    * Top sections contains filter inputs:
        * Donor Name (text input)
        * Email (text input)
        * Date Range of Last Donation (start and end)
        * Source (dropdown)
        * Submit button to apply filters
    * Table displays donor data:
        * **Columns:**
            * Full Name
            * Email
            * Phone Number
            * Last Donation Date
            * Number of Donations
            * Total Amount Donations
            * Total Amount Donated
            * Actions (Edit and Delete)
* **Mass Email Feature:**
    * Checkbox next to each donor for selecting recipients
    * “Send Email” button appears when at least one is selected
    * Sends pre-formatted emails or allows custom message input
* **Edit Donor Modal**
    * Fields for name, email, phone, and address
    * Update and Cancel buttons
* **Delete Donor Modal**
    * Confirms deletion
    * Deletes donor and their associated donations unless otherwise specified

### View Grants

* **Layout**
    * Top of the page has several text input boxes or dropdown menus that allow the user to filter through the grants table based on different attributes
        * All attributes can be left blank
        * Organization Name (text input box)
        * Proposal Date (filter between a start date and an end date)
        * Award Date (filter between a start date and an end date)
        * Start Date (filter between a start date and an end date)
        * Expiration Date (filter between a start date and an end date)
        * Allocated For (dropdown menu)
        * Status (dropdown menu)
        * Board Member (dropdown menu)
    * The user hits a Submit button to filter through the tables based on the attributes that have been filled in
    * Every dropdown menu and date has an X button to clear the input
    * Bottom of the page has a table
        * The table and its headers still display if there are no grants
        * If the table is too wide to fit on a single page, the header, navbar, and the left side of the table will be shown upon loading the View Grants page, and the user will have to scroll to the right to view the rest of the table
    * **16 columns, each with its header, from left to right**
        * Organization
            * Can’t be blank because organization is a required attribute when adding a grant, and there is no default organization name
        * POC Name
            * Name of point of contact for the organization
            * Optional attribute when adding a grant, but if no POC name is given, the default name is “Anonymous Anonymous”
        * Funds Requested
            * Always shows a $ sign and two digits to the right of the decimal point
            * Can’t be negative
        * In-Kind Requested
        * Funds Received
            * Always shows a $ sign and two digits to the right of the decimal point
            * Can’t be negative
            * Can be higher or lower than Funds Requested
        * In-Kind Received
        * Funds Spent
            * Always shows a $ sign and two digits to the right of the decimal point
            * Can’t be negative
            * Can be lower than Funds Received, but not higher
        * Proposal Date
        * Award Date
            * Can’t be before Proposal Date
        * Start Date
            * Can’t be before Proposal Date or Award Date
        * Expiration Date
            * Can’t be before Proposal Date, Award Date, or Start Date
        * Allocated For
        * Status
        * Board Member
            * Full name of the board member who solicited the grant, if any
            * Optional attribute, can be blank, no default board member name if left blank
        * Notes
            * Can be blank
            * A file icon that, when clicked, opens a new tab that contains a PDF file of the notes
        * Actions
            * Two columns
            * Blue button on the left that says “Edit”
                * Clicking on it brings up an edit pop-up menu
            * Red button on the right that says “Delete”
                * Clicking on it brings up a delete pop-up menu
* **Edit Popup Menu**
    * Titled “Edit Grant”
    * Has 19 rows, from top to bottom
        * Grant/Organization Name
        * Contact First Name (Optional)
        * Contact Last Name (Optional)
        * Contact Email (Optional)
        * Contact Phone Number (Optional)
        * Contact Address (Optional)
        * Amount Requested
        * Non-Monetary Amount Requested
        * Amount Received
        * Non-Monetary Amount Received
        * Amount Spent
        * Allocation Purpose
        * Proposal Date
        * Award Date
        * Start Date
        * Expiration Date
        * Status
            * Dropdown menu
        * Board Member
            * Dropdown menu
        * Notes
            * Accepts a file input
    * All requirements for the table columns apply to the corresponding rows in the Edit Popup Menu
    * Green Update button at the bottom of the menu that applies any changes made
    * Gray Cancel button at the bottom of the menu that cancels any changes made
* **Delete Popup Menu**
    * Titled “Confirm Deletion”
    * Displays the message “Are you sure you want to delete this grant from <Organization>?”
    * Red Delete button at the bottom
    * Gray Cancel button at the bottom

### Add Grant

* **Layout**
    * Titled “Add New Grant”
    * Light blue background
    * 16 Input boxes in two columns, from left to right and then top to bottom
        * Grantor Organization
        * Contact First Name
        * Contact Last Name
        * Contact Email
        * Contact Phone
        * Contact Address
        * Amount Requested
        * Nonmonetary Amount Requested
        * Purpose
            * Dropdown menu
        * Proposal Date
        * Award Date
        * Start Date
        * Expiration Date
        * Status
            * Dropdown menu
        * Board Member
            * Dropdown menu
        * Notes
            * Accepts a file input
    * All requirements for the table columns and Edit Popup Menu apply to the corresponding input boxes on the Add Grant page
    * Not possible to add an Amount Received, Nonmonetary Amount Received, or Amount Spent on the Add Grant page

### Create Accounts Page

1.  **Form Display:**
    * 1.1. The system shall display a form with the title "Create Account"
    * 1.2. The form shall include input fields for: First Name, Last Name, Email, and Role.
    * 1.3. The form shall include a button labeled "Send Invite".
    * 1.4. Fields marked with an asterisk (\*) (Last Name, Email, Role) shall be visually indicated as mandatory.
2.  **Role Selection:**
    * The system shall provide a drop-down selection field for the following roles: Viewer, Editor, Admin, and Main Admin. This is the role that the newly created user account will be assigned to.
3.  **Send Invite:**
    * The “Send Invite” button may remain disabled until all mandatory fields are filled with valid data. Upon clicking “Send Invite” the system shall perform validation on all mandatory fields.
    * If validation fails, the system shall:
        * 1. Prevent the form submission.
        * 2. Display clear, user-friendly error messages indicating which fields are invalid and why.
        * 3. Retain the data entered by the user in the form fields.
    * If validation succeeds, the system shall:
        * 1. Initiate the user invitation process:
            * Create a user record in the system with the provided details and a ‘Pending Invite’ status
            * Generate a unique invitation token or link
            * Send an email to the provided email address containing the invitation link/instructions to set up their password and activate the account
        * 2. On validation success, the system will also provide feedback to the admin confirming the invitation was sent successfully (a success message, a form clear, or redirection). It should also handle any potential errors during the backend process (email sending error or database error) and inform the admin with an appropriate error message.
* Only the accounts with the appropriate privileges (admin roles) may create account invites.

### View Roles Page

* **Layout**
    * Page consists of a table with five rows and six columns
    * **Row names from top to bottom**
        * Role Name
        * Main Admin
        * Admin
        * Editor
        * Viewer
    * **Column names from left to right**
        * Role Name
        * View “Donations” And “Grants”
        * Edit “Donations” And “Grants”
        * View “Settings”
        * Edit “Manage Accounts”
        * Edit “Create Accounts”
    * Where a row and a column intersect, there will be a green check mark if a user with the role has permission to do something, and a red X if a user with the role does not have permission to do something
    * We are using static role permissions for the time being, and while users can be given different roles, the permissions associated with each role can’t be changed, not even by the Main Admin

### Manage Accounts Page

* **Page Access and Display:**
    * Access to the “Manage Accounts” page shall be restricted to users with specific roles (Admins and/or Main Admin). Users without these roles should not be able to navigate to or view this page.
    * The system shall display the title “Manage Accounts”
    * The system shall display a table presenting a list of user accounts
    * The table shall include the following columns: FIRST NAME, LAST NAME, ROLE, EMAIL, ACTIONS
* **User Account Listing**
    * The system shall fetch and display a list of user accounts from the system, excluding the currently logged-in administrator's own account. (Alternative: Display own account but disable all actions for that row).
    * Each row in the table shall represent one user account and display the user's First Name, Last Name, Role, and Email address in the respective columns
* **Role Display**
    * The ROLE column shall contain a dropdown selector for each user row. Each dropdown shall be populated with the list of available user roles within the system. Role modification could be restricted based on the logged-in administrator’s role (for example, only a Main Admin can change the role of an Admin)
    * Possibly a “Save” button per row or for the page, or automatic saving when a dropdown value is changed
    * Feedback on successful role update, or if an error occurs
    * If roles are not editable on this screen, possibly display the ROLE column as static text
* **Freeze/Unfreeze Accounts**
    * The actions column will contain 2 buttons per account: Freeze/Unfreeze and Delete, enabled only for Admins or Main Admin
    * Users with frozen accounts shall be prevented from logging into the system. Users with active accounts will be allowed to log in
* **Delete Accounts**
    * The system MUST display a confirmation dialog before deleting an account
    * The system shall either soft delete (mark account as deleted) or hard delete (remove the record entirely)
    * The deleted user’s role shall be removed from the table display
* **Error Handling**
    * Clear, user-friendly error messages shall be displayed to the admin if an action fails
* **Optional**
    * Implement pagination if the number of users becomes too large (probably not, as there is a limited number of board members, but still)
    * Add searching or filtering capabilities
    * Accessibility: Make all elements keyboard accessible, and add clear visual feedback

## Figma Mockups

The project’s Figma mockups can be found under the `mckinney-library-nuxt-app/figma` directory. In this Figma mockup, the UI design of each page of the site is displayed. Throughout the semester, while we worked on the project, we obtained feedback from our partners, which led to significant design changes. Therefore, if there are discrepancies between the Figma mockups and the site itself, it’s because we have changed aspects of the project to fit our partner’s needs. Though the overall purpose of the project and most functionalities remain the same, it’s important to make a note of the Figma mockups in case the following semesters are confused as to why the Figma and the site look a bit different.

## Third Party Integrations

As of the end of the first semester of development on this project, we do not have any third-party integrations.

## Tech Stacks

* **Frontend:** Vue
* **Database:** SQLite and Prisma
* **VSCode Extensions:** Docker, Prisma, and Vue
* **Other:** Nuxt

## Deployment Notes

As of the end of the first semester of development on this project, we do not have any deployment notes. We have not deployed the site and it is running locally on our devices at the moment. When we talked to Taz, he said we would be using Amazon Web Services (AWS) for deployment. The deployment will need to be talked about during later semesters’ work on the project.

## Migration Scripts

Our partner has no existing system - other than their Excel file - that they are using to track their data. Therefore, we do not have to import any data from these systems.

## Instructions for Setting up Development Environment

1.  Clone the `mckinney-library-foundation` repository.
2.  Open the project in VSCode.
3.  Navigate to the `mckinney-library-nuxt-app` directory.
4.  Create a `.env` file with the database url in it:
    ```
    DATABASE_URL="file:./mplf.db"
    ```
5.  Install project dependencies using `npm install`.
6.  Run `npm install @prisma/client`
7.  Run `npx prisma generate`
8.  Run the site locally using `npm run dev`.
9.  Access the site at `http://localhost:3000` in the browser.
