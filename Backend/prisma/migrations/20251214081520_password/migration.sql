/*
  Warnings:

  - Made the column `password` on table `user_spam` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user_spam" ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "password" DROP DEFAULT;
