-- CreateTable
CREATE TABLE "Sugestao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sugestao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tabloide" (
    "id" INTEGER NOT NULL,
    "frente" TEXT NOT NULL,
    "verso" TEXT NOT NULL,

    CONSTRAINT "Tabloide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
