/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `personal` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `vendedor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "personal_email_key" ON "personal"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vendedor_email_key" ON "vendedor"("email");
