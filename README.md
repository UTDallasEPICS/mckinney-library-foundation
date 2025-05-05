# McKinney Public Library Foundation: Donor and Grant Tracking

Welcome to the official repository for the McKinney Public Library Foundation (MPLF) Donor and Grant Tracking Application.

This project was developed through the UT Dallas EPICS program to help MPLF efficiently manage donor information, grant applications, and track funding over time.

---

## 📌 Conceptual Overview

The MPLF Tracking System is designed to:

- Store and manage information about donors, grants, and users.
- Allow staff to log donations and grant requests.
- Provide a secure, role-based access system.
- Offer a simple interface for non-technical users.

---

## 👥 Users & Roles

| Role         | Permissions                                                                 |
|--------------|-------------------------------------------------------------------------------|
| Main Admin   | Full access. Manage all data, assign roles.                                |
| Admin        | Add/edit/delete donors, grants, users. Cannot assign roles.                |
| Editor       | Add/edit donors and grants. Cannot delete or manage users.                 |
| Viewer       | View-only access. Cannot create, edit, or delete records.                  |

Roles are enforced on both frontend and backend. For more details, see the [Roles Wiki Page](https://github.com/UTDallasEPICS/mckinney-library-foundation/wiki/User-Roles).

---

## ✅ Functional Requirements

### Donors
- View donor list
- Add new donor
- Edit donor information

### Donations
- Add donation for existing or new donors
- Edit donation info
- View all donation history

### Grants
- View grants
- Add new grant record
- Edit existing grant

### Users
- Invite new users (admin only)
- Edit user roles and permissions

---

## 🔧 Tech Stack

- **Frontend & Backend Framework**: [Nuxt.js 3](https://nuxt.com)
- **Database**: SQLite using [Prisma ORM](https://www.prisma.io/)
- **Language**: TypeScript
- **UI Framework**: Tailwind CSS
- **Testing**: (TBD)

---

## 🧩 Third Party Integrations

Currently, no external services are fully integrated. The codebase is structured to allow:

- Future integration with authentication providers (e.g., Auth0 or Clerk)
- Expansion into external donation platforms

---

## 🚀 Deployment Notes

This application has **not** yet been deployed to production.

To run locally:

```bash
# Clone the repository
$ git clone https://github.com/UTDallasEPICS/mckinney-library-foundation.git

# Navigate into the Nuxt app
$ cd mckinney-library-nuxt-app

# Install dependencies
$ npm install

# Create a .env file
$ cp .env.example .env

# Start local server
$ npm run dev

# Open app at http://localhost:3000
```

---

## 🛠 Migration Scripts

We use Prisma for managing database schema and migrations.

```bash
# Apply latest migration
$ npx prisma migrate dev --name init

# Open visual DB editor
$ npx prisma studio
```

---

## 📂 Folder Structure

- `pages/` – Nuxt routes (e.g., /donors, /grants)
- `components/` – UI elements
- `server/api/` – Backend API routes
- `prisma/` – Database schema and migrations
- `composables/` – Shared logic (fetching, auth)
- `.env.example` – Sample environment config

---

## 📖 Documentation

Full documentation lives in the [GitHub Wiki](https://github.com/UTDallasEPICS/mckinney-library-foundation/wiki), including:

- Database schema
- Entity relationship diagrams
- User workflows
- Role permissions
- Troubleshooting tips

---

## 🧪 Testing

To be added: unit tests and integration testing suite.

---

## 📄 License

MIT License — open-source under UT Dallas EPICS guidelines.
