/*
  Warnings:

  - The `tglSidang` column on the `Debitor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `batasAkhir` column on the `Debitor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tglVerifikasi` column on the `Debitor` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Debitor" DROP COLUMN "tglSidang",
ADD COLUMN     "tglSidang" TIMESTAMP(3),
DROP COLUMN "batasAkhir",
ADD COLUMN     "batasAkhir" TIMESTAMP(3),
DROP COLUMN "tglVerifikasi",
ADD COLUMN     "tglVerifikasi" TIMESTAMP(3);
