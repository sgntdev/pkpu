-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserVerify" (
    "email" TEXT NOT NULL,
    "uniqueCode" VARCHAR(25) NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserVerify_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Debitor" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "tglSidang" TEXT NOT NULL,
    "tempatSidang" TEXT NOT NULL,

    CONSTRAINT "Debitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kreditor" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "noTelp" VARCHAR(13) NOT NULL,

    CONSTRAINT "Kreditor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tagihan" (
    "id" SERIAL NOT NULL,
    "debitorId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "kreditorId" INTEGER NOT NULL,
    "pertanggal" TEXT NOT NULL,
    "hutangPokok" TEXT NOT NULL,
    "bunga" TEXT NOT NULL,
    "denda" TEXT NOT NULL,
    "sifatTagihanId" INTEGER NOT NULL,
    "jumlahTagihan" TEXT NOT NULL,
    "mulaiTertunggak" TEXT NOT NULL,
    "jumlahHari" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,

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
    "tagihanId" INTEGER NOT NULL,
    "nama_dokumen" TEXT NOT NULL,
    "dokumen_url" TEXT NOT NULL,

    CONSTRAINT "DokumenTagihan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verified" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "uniqueCode" VARCHAR(25) NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verified_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserVerify_email_key" ON "UserVerify"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserVerify_uniqueCode_key" ON "UserVerify"("uniqueCode");

-- CreateIndex
CREATE UNIQUE INDEX "Verified_uniqueCode_key" ON "Verified"("uniqueCode");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kreditor" ADD CONSTRAINT "Kreditor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tagihan" ADD CONSTRAINT "Tagihan_debitorId_fkey" FOREIGN KEY ("debitorId") REFERENCES "Debitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tagihan" ADD CONSTRAINT "Tagihan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
