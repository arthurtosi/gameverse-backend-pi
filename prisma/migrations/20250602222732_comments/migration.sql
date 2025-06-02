/*
  Warnings:

  - You are about to drop the `games` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ratings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('RPG', 'ACAO', 'ESPORTE', 'MUNDO_ABERTO', 'SIMULADOR', 'TERROR', 'EDUCATIVO', 'CARTAS', 'TABULEIRO', 'AVENTURA');

-- DropForeignKey
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_author_id_fkey";

-- DropForeignKey
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_gameId_fkey";

-- DropTable
DROP TABLE "games";

-- DropTable
DROP TABLE "ratings";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "foto" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "release_date" TIMESTAMP(3) NOT NULL,
    "foto" TEXT NOT NULL,
    "category" "GameType" NOT NULL,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rating" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rate" INTEGER NOT NULL,
    "author_id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rate" INTEGER,
    "ratingId" TEXT NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_ratingId_fkey" FOREIGN KEY ("ratingId") REFERENCES "rating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
