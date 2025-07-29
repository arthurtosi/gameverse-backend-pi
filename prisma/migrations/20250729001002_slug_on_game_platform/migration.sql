/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `GamePlatform` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `GamePlatform` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GamePlatform" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GamePlatform_slug_key" ON "GamePlatform"("slug");
