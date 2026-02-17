/*
  Warnings:

  - You are about to drop the `person_on_organization` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[organizationId,cpf]` on the table `person` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organizationId,nis]` on the table `person` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationId` to the `person` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "person_on_organization" DROP CONSTRAINT "person_on_organization_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "person_on_organization" DROP CONSTRAINT "person_on_organization_personId_fkey";

-- DropForeignKey
ALTER TABLE "person_on_organization" DROP CONSTRAINT "person_on_organization_userId_fkey";

-- DropIndex
DROP INDEX "person_cpf_key";

-- DropIndex
DROP INDEX "person_nis_key";

-- AlterTable
ALTER TABLE "person" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- DropTable
DROP TABLE "person_on_organization";

-- CreateIndex
CREATE INDEX "person_organizationId_idx" ON "person"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "person_organizationId_cpf_key" ON "person"("organizationId", "cpf");

-- CreateIndex
CREATE UNIQUE INDEX "person_organizationId_nis_key" ON "person"("organizationId", "nis");

-- AddForeignKey
ALTER TABLE "person" ADD CONSTRAINT "person_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
