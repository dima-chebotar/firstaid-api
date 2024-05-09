-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('CONSUMER_TO_GPT', 'CONSUMER_TO_CONSUMER', 'CONSUMER_TO_SUPPORT');

-- CreateEnum
CREATE TYPE "MessageFrom" AS ENUM ('USER', 'ASSISTANT_GPT', 'SUPPORT');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "isEmailConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "birthdate" TIMESTAMP(3),
    "gender" TEXT,
    "weight" INTEGER,
    "country" TEXT,
    "avatar" TEXT,
    "provider" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatRooms" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "RoomType" NOT NULL DEFAULT 'CONSUMER_TO_GPT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatRooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessages" (
    "id" SERIAL NOT NULL,
    "chatRoomId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "from" "MessageFrom" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatMessages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneralBloodAnalyses" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "esr" DOUBLE PRECISION,
    "plt" DOUBLE PRECISION,
    "rdwSd" DOUBLE PRECISION,
    "pdw" DOUBLE PRECISION,
    "mpv" DOUBLE PRECISION,
    "pLcr" DOUBLE PRECISION,
    "pct" DOUBLE PRECISION,
    "lymph_rel" DOUBLE PRECISION,
    "lymph_abs" DOUBLE PRECISION,
    "mono_rel" DOUBLE PRECISION,
    "mono_abs" DOUBLE PRECISION,
    "hct" DOUBLE PRECISION,
    "hgb" DOUBLE PRECISION,
    "rbc" DOUBLE PRECISION,
    "mcv" DOUBLE PRECISION,
    "mch" DOUBLE PRECISION,
    "mchc" DOUBLE PRECISION,
    "wbc" DOUBLE PRECISION,
    "neut_abs" DOUBLE PRECISION,
    "eo_abs" DOUBLE PRECISION,
    "baso_abs" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneralBloodAnalyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneralBloodAnalysisMessages" (
    "id" SERIAL NOT NULL,
    "generalBloodAnalysisId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "from" "MessageFrom" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneralBloodAnalysisMessages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ChatRooms_id_key" ON "ChatRooms"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GeneralBloodAnalyses_id_key" ON "GeneralBloodAnalyses"("id");

-- AddForeignKey
ALTER TABLE "ChatRooms" ADD CONSTRAINT "ChatRooms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessages" ADD CONSTRAINT "ChatMessages_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralBloodAnalyses" ADD CONSTRAINT "GeneralBloodAnalyses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralBloodAnalysisMessages" ADD CONSTRAINT "GeneralBloodAnalysisMessages_generalBloodAnalysisId_fkey" FOREIGN KEY ("generalBloodAnalysisId") REFERENCES "GeneralBloodAnalyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
