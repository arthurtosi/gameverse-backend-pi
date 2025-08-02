-- CreateEnum
CREATE TYPE "GameStatusEnum" AS ENUM ('PLAYING', 'COMPLETED', 'ON_HOLD', 'DROPPED', 'WISH_LIST');

-- CreateTable
CREATE TABLE "UserGameStatus" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "status" "GameStatusEnum" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserGameStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserGameStatus_userId_gameId_key" ON "UserGameStatus"("userId", "gameId");

-- AddForeignKey
ALTER TABLE "UserGameStatus" ADD CONSTRAINT "UserGameStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGameStatus" ADD CONSTRAINT "UserGameStatus_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
