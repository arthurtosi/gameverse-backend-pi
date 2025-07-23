/*
  Warnings:

  - You are about to drop the column `ratingId` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `game` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `rating` table. All the data in the column will be lost.
  - You are about to drop the column `gameId` on the `rating` table. All the data in the column will be lost.
  - Added the required column `rating_id` to the `comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `game_id` to the `rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `rating` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_ratingId_fkey";

-- DropForeignKey
ALTER TABLE "rating" DROP CONSTRAINT "rating_gameId_fkey";

-- AlterTable
ALTER TABLE "comment" DROP COLUMN "ratingId",
ADD COLUMN     "rating_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "game" DROP COLUMN "category";

-- AlterTable
ALTER TABLE "rating" DROP COLUMN "description",
DROP COLUMN "gameId",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "game_id" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "bio" TEXT;

-- DropEnum
DROP TYPE "GameType";

-- CreateTable
CREATE TABLE "GameList" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "is_public" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "GameList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GamePlatform" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "GamePlatform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameGenre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,

    CONSTRAINT "GameGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelationGameAndGameList" (
    "gameId" TEXT NOT NULL,
    "gamelistId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GameList_userId_key" ON "GameList"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RelationGameAndGameList_gameId_key" ON "RelationGameAndGameList"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "RelationGameAndGameList_gamelistId_key" ON "RelationGameAndGameList"("gamelistId");

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_rating_id_fkey" FOREIGN KEY ("rating_id") REFERENCES "rating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameList" ADD CONSTRAINT "GameList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamePlatform" ADD CONSTRAINT "GamePlatform_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameGenre" ADD CONSTRAINT "GameGenre_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationGameAndGameList" ADD CONSTRAINT "RelationGameAndGameList_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationGameAndGameList" ADD CONSTRAINT "RelationGameAndGameList_gamelistId_fkey" FOREIGN KEY ("gamelistId") REFERENCES "GameList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
