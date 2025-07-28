-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_rating_id_fkey";

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_rating_id_fkey" FOREIGN KEY ("rating_id") REFERENCES "rating"("id") ON DELETE CASCADE ON UPDATE CASCADE;
