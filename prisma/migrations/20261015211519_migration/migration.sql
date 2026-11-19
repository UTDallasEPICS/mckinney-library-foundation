/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Donor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Donor` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Donor_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Donor_phone_key" ON "Donor"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_email_key" ON "Donor"("email");
