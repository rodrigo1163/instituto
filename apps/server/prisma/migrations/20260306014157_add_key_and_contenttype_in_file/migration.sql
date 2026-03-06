/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `file` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contentType` to the `file` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "file" ADD COLUMN     "contentType" TEXT NOT NULL,
ADD COLUMN     "key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "file_key_key" ON "file"("key");
