/*
  Warnings:

  - You are about to drop the column `instituteId` on the `membership` table. All the data in the column will be lost.
  - You are about to drop the `institute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `person_on_institut` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,organizationId]` on the table `membership` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationId` to the `membership` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "institute" DROP CONSTRAINT "institute_createdById_fkey";

-- DropForeignKey
ALTER TABLE "membership" DROP CONSTRAINT "membership_instituteId_fkey";

-- DropForeignKey
ALTER TABLE "person_on_institut" DROP CONSTRAINT "person_on_institut_instituteId_fkey";

-- DropForeignKey
ALTER TABLE "person_on_institut" DROP CONSTRAINT "person_on_institut_personId_fkey";

-- DropForeignKey
ALTER TABLE "person_on_institut" DROP CONSTRAINT "person_on_institut_userId_fkey";

-- DropIndex
DROP INDEX "membership_instituteId_idx";

-- DropIndex
DROP INDEX "membership_userId_instituteId_key";

-- AlterTable
ALTER TABLE "membership" DROP COLUMN "instituteId",
ADD COLUMN     "organizationId" TEXT NOT NULL;

-- DropTable
DROP TABLE "institute";

-- DropTable
DROP TABLE "person_on_institut";

-- CreateTable
CREATE TABLE "organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "person_on_organization" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "personId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "person_on_organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organization_slug_key" ON "organization"("slug");

-- CreateIndex
CREATE INDEX "membership_organizationId_idx" ON "membership"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "membership_userId_organizationId_key" ON "membership"("userId", "organizationId");

-- AddForeignKey
ALTER TABLE "organization" ADD CONSTRAINT "organization_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership" ADD CONSTRAINT "membership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_on_organization" ADD CONSTRAINT "person_on_organization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_on_organization" ADD CONSTRAINT "person_on_organization_personId_fkey" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_on_organization" ADD CONSTRAINT "person_on_organization_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
