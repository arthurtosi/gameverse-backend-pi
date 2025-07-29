/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `GameGenre` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `GameGenre` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameGenre" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GameGenre_slug_key" ON "GameGenre"("slug");
