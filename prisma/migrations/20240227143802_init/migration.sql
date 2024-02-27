-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "uniqueCode" VARCHAR(25) NOT NULL,
    "roleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kreditor" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "noTelp" VARCHAR(13) NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Kreditor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tagihan" (
    "id" SERIAL NOT NULL,
    "kreditorId" INTEGER NOT NULL,
    "pertanggal" TEXT NOT NULL,
    "hutangPokok" TEXT NOT NULL,
    "bunga" TEXT NOT NULL,
    "denda" TEXT NOT NULL,
    "sifatTagihanId" INTEGER NOT NULL,
    "jumlahTagihan" TEXT NOT NULL,
    "mulaiTertunggak" TEXT NOT NULL,
    "jumlahHari" TEXT NOT NULL,

    CONSTRAINT "Tagihan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SifatTagihan" (
    "id" SERIAL NOT NULL,
    "sifat" TEXT NOT NULL,

    CONSTRAINT "SifatTagihan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipeDokumen" (
    "id" SERIAL NOT NULL,
    "tipe" TEXT NOT NULL,
    "sifatTagihanId" INTEGER NOT NULL,

    CONSTRAINT "TipeDokumen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DokumenTagihan" (
    "id" SERIAL NOT NULL,
    "tipeDokumenId" INTEGER NOT NULL,
    "tagihanId" INTEGER,
    "dokumen" TEXT NOT NULL,

    CONSTRAINT "DokumenTagihan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_uniqueCode_key" ON "Users"("uniqueCode");

-- CreateIndex
CREATE UNIQUE INDEX "Kreditor_email_key" ON "Kreditor"("email");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tagihan" ADD CONSTRAINT "Tagihan_kreditorId_fkey" FOREIGN KEY ("kreditorId") REFERENCES "Kreditor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tagihan" ADD CONSTRAINT "Tagihan_sifatTagihanId_fkey" FOREIGN KEY ("sifatTagihanId") REFERENCES "SifatTagihan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TipeDokumen" ADD CONSTRAINT "TipeDokumen_sifatTagihanId_fkey" FOREIGN KEY ("sifatTagihanId") REFERENCES "SifatTagihan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DokumenTagihan" ADD CONSTRAINT "DokumenTagihan_tagihanId_fkey" FOREIGN KEY ("tagihanId") REFERENCES "Tagihan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DokumenTagihan" ADD CONSTRAINT "DokumenTagihan_tipeDokumenId_fkey" FOREIGN KEY ("tipeDokumenId") REFERENCES "TipeDokumen"("id") ON DELETE CASCADE ON UPDATE CASCADE;
