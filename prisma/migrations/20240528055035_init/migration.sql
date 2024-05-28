/*
  Warnings:

  - You are about to drop the column `petugasAccess` on the `Debitor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Debitor" DROP COLUMN "petugasAccess",
ADD COLUMN     "pengurusAccess" INTEGER[];
