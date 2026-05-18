/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `UserProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `UserProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserProfile_nickname_key";

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_slug_key" ON "UserProfile"("slug");
