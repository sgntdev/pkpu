-- AlterTable
ALTER TABLE "TagihanVote" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "tagihanItem" (
    "id" SERIAL NOT NULL,
    "tagihanId" INTEGER NOT NULL,
    "sifatTagihanId" INTEGER NOT NULL,
    "tipe" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tagihanItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tagihanItem" ADD CONSTRAINT "tagihanItem_sifatTagihanId_fkey" FOREIGN KEY ("sifatTagihanId") REFERENCES "SifatTagihan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tagihanItem" ADD CONSTRAINT "tagihanItem_tagihanId_fkey" FOREIGN KEY ("tagihanId") REFERENCES "Tagihan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
