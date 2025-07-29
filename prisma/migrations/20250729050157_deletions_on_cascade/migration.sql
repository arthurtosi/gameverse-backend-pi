-- DropForeignKey
ALTER TABLE "GameList" DROP CONSTRAINT "GameList_userId_fkey";

-- DropForeignKey
ALTER TABLE "RelationGameAndGameGenre" DROP CONSTRAINT "RelationGameAndGameGenre_gameGenreId_fkey";

-- DropForeignKey
ALTER TABLE "RelationGameAndGameGenre" DROP CONSTRAINT "RelationGameAndGameGenre_gameId_fkey";

-- DropForeignKey
ALTER TABLE "RelationGameAndGameList" DROP CONSTRAINT "RelationGameAndGameList_gameId_fkey";

-- DropForeignKey
ALTER TABLE "RelationGameAndGameList" DROP CONSTRAINT "RelationGameAndGameList_gamelistId_fkey";

-- DropForeignKey
ALTER TABLE "RelationGameAndGamePlatform" DROP CONSTRAINT "RelationGameAndGamePlatform_gameId_fkey";

-- DropForeignKey
ALTER TABLE "RelationGameAndGamePlatform" DROP CONSTRAINT "RelationGameAndGamePlatform_gamePlatformId_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_user_id_fkey";

-- DropForeignKey
ALTER TABLE "rating" DROP CONSTRAINT "rating_author_id_fkey";

-- DropForeignKey
ALTER TABLE "rating" DROP CONSTRAINT "rating_game_id_fkey";

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameList" ADD CONSTRAINT "GameList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationGameAndGameList" ADD CONSTRAINT "RelationGameAndGameList_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationGameAndGameList" ADD CONSTRAINT "RelationGameAndGameList_gamelistId_fkey" FOREIGN KEY ("gamelistId") REFERENCES "GameList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationGameAndGameGenre" ADD CONSTRAINT "RelationGameAndGameGenre_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationGameAndGameGenre" ADD CONSTRAINT "RelationGameAndGameGenre_gameGenreId_fkey" FOREIGN KEY ("gameGenreId") REFERENCES "GameGenre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationGameAndGamePlatform" ADD CONSTRAINT "RelationGameAndGamePlatform_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationGameAndGamePlatform" ADD CONSTRAINT "RelationGameAndGamePlatform_gamePlatformId_fkey" FOREIGN KEY ("gamePlatformId") REFERENCES "GamePlatform"("id") ON DELETE CASCADE ON UPDATE CASCADE;
