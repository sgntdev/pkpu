/*
  Warnings:

  - You are about to drop the column `pengadilan` on the `Debitor` table. All the data in the column will be lost.
  - The `tglSidang` column on the `Debitor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `batasAkhir` column on the `Debitor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tglVerifikasi` column on the `Debitor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `kurs` on table `Debitor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `noPerkara` on table `Debitor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Debitor" DROP COLUMN "pengadilan",
DROP COLUMN "tglSidang",
ADD COLUMN     "tglSidang" TIMESTAMP(3),
DROP COLUMN "batasAkhir",
ADD COLUMN     "batasAkhir" TIMESTAMP(3),
ALTER COLUMN "kurs" SET NOT NULL,
ALTER COLUMN "noPerkara" SET NOT NULL,
DROP COLUMN "tglVerifikasi",
ADD COLUMN     "tglVerifikasi" TIMESTAMP(3);
