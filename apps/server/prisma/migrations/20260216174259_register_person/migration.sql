-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('NONE', 'ELEMENTARY_INCOMPLETE', 'ELEMENTARY_COMPLETE', 'HIGH_SCHOOL_INCOMPLETE', 'HIGH_SCHOOL_COMPLETE', 'TECHNICAL', 'UNIVERSITY_INCOMPLETE', 'UNIVERSITY_COMPLETE', 'POSTGRAD');

-- CreateEnum
CREATE TYPE "KinshipDegree" AS ENUM ('SPOUSE', 'CHILD', 'FATHER', 'MOTHER', 'SIBLING', 'GRANDPARENT', 'GRANDCHILD', 'UNCLE_AUNT', 'NEPHEW_NIECE', 'COUSIN', 'OTHER');

-- CreateEnum
CREATE TYPE "PersonDocumentType" AS ENUM ('WALLET_PHOTO', 'OTHER');

-- CreateTable
CREATE TABLE "person" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "phoneNumber" TEXT,
    "fatherName" TEXT,
    "motherName" TEXT,
    "educationLevel" "EducationLevel",
    "receivesBolsaFamilia" BOOLEAN NOT NULL DEFAULT false,
    "nis" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "personId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "person_relative" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "relativeName" TEXT NOT NULL,
    "degree" "KinshipDegree" NOT NULL,
    "degreeText" TEXT,
    "phoneNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "person_relative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "partnerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "person_course" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "person_course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assistance_type" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assistance_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "person_assistance" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "assistanceTypeId" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity" INTEGER,
    "valueCents" INTEGER,
    "notes" TEXT,

    CONSTRAINT "person_assistance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "person_document" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "type" "PersonDocumentType" NOT NULL DEFAULT 'WALLET_PHOTO',
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT,
    "mimeType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "person_document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "person_cpf_key" ON "person"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "person_nis_key" ON "person"("nis");

-- CreateIndex
CREATE INDEX "person_fullName_idx" ON "person"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "address_personId_key" ON "address"("personId");

-- CreateIndex
CREATE INDEX "person_relative_personId_idx" ON "person_relative"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "course_partner_name_key" ON "course_partner"("name");

-- CreateIndex
CREATE INDEX "course_partnerId_idx" ON "course"("partnerId");

-- CreateIndex
CREATE INDEX "course_title_idx" ON "course"("title");

-- CreateIndex
CREATE INDEX "person_course_courseId_idx" ON "person_course"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "person_course_personId_courseId_key" ON "person_course"("personId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "assistance_type_name_key" ON "assistance_type"("name");

-- CreateIndex
CREATE INDEX "person_assistance_personId_idx" ON "person_assistance"("personId");

-- CreateIndex
CREATE INDEX "person_assistance_assistanceTypeId_idx" ON "person_assistance"("assistanceTypeId");

-- CreateIndex
CREATE INDEX "person_document_personId_idx" ON "person_document"("personId");

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_personId_fkey" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_relative" ADD CONSTRAINT "person_relative_personId_fkey" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "course_partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_course" ADD CONSTRAINT "person_course_personId_fkey" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_course" ADD CONSTRAINT "person_course_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_assistance" ADD CONSTRAINT "person_assistance_personId_fkey" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_assistance" ADD CONSTRAINT "person_assistance_assistanceTypeId_fkey" FOREIGN KEY ("assistanceTypeId") REFERENCES "assistance_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_document" ADD CONSTRAINT "person_document_personId_fkey" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
