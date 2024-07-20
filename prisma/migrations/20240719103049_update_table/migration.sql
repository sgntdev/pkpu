/*
  Warnings:

  - You are about to drop the `Menu` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tagihanItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tagihanItem" DROP CONSTRAINT "tagihanItem_sifatTagihanId_fkey";

-- DropForeignKey
ALTER TABLE "tagihanItem" DROP CONSTRAINT "tagihanItem_tagihanId_fkey";

-- DropTable
DROP TABLE "Menu";

-- DropTable
DROP TABLE "tagihanItem";

-- CreateTable
CREATE TABLE "TagihanItem" (
    "id" SERIAL NOT NULL,
    "tagihanId" INTEGER NOT NULL,
    "sifatTagihanId" INTEGER NOT NULL,
    "tipe" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TagihanItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TagihanItem" ADD CONSTRAINT "TagihanItem_sifatTagihanId_fkey" FOREIGN KEY ("sifatTagihanId") REFERENCES "SifatTagihan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagihanItem" ADD CONSTRAINT "TagihanItem_tagihanId_fkey" FOREIGN KEY ("tagihanId") REFERENCES "Tagihan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
