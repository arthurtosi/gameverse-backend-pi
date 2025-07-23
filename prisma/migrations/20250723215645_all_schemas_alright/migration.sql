/*
  Warnings:

  - You are about to drop the column `game_id` on the `GameGenre` table. All the data in the column will be lost.
  - You are about to drop the column `game_id` on the `GamePlatform` table. All the data in the column will be lost.
  - The required column `id` was added to the `RelationGameAndGameList` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `user_id` to the `comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GameGenre" DROP CONSTRAINT "GameGenre_game_id_fkey";

-- DropForeignKey
ALTER TABLE "GamePlatform" DROP CONSTRAINT "GamePlatform_game_id_fkey";

-- DropIndex
DROP INDEX "RelationGameAndGameList_gameId_key";

-- DropIndex
DROP INDEX "RelationGameAndGameList_gamelistId_key";

-- AlterTable
ALTER TABLE "GameGenre" DROP COLUMN "game_id";

-- AlterTable
ALTER TABLE "GamePlatform" DROP COLUMN "game_id";

-- AlterTable
ALTER TABLE "RelationGameAndGameList" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "RelationGameAndGameList_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "comment" ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "RelationGameAndGameGenre" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "gameGenreId" TEXT NOT NULL,

    CONSTRAINT "RelationGameAndGameGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelationGameAndGamePlatform" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "gamePlatformId" TEXT NOT NULL,

    CONSTRAINT "RelationGameAndGamePlatform_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationGameAndGameGenre" ADD CONSTRAINT "RelationGameAndGameGenre_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationGameAndGameGenre" ADD CONSTRAINT "RelationGameAndGameGenre_gameGenreId_fkey" FOREIGN KEY ("gameGenreId") REFERENCES "GameGenre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationGameAndGamePlatform" ADD CONSTRAINT "RelationGameAndGamePlatform_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationGameAndGamePlatform" ADD CONSTRAINT "RelationGameAndGamePlatform_gamePlatformId_fkey" FOREIGN KEY ("gamePlatformId") REFERENCES "GamePlatform"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
