-- CreateEnum
CREATE TYPE "AuthMethod" AS ENUM ('local', 'google');

-- CreateEnum
CREATE TYPE "Result" AS ENUM ('ham', 'spam');

-- CreateTable
CREATE TABLE "user_spam" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "googleId" TEXT,
    "profilePicture" TEXT,
    "authMethods" "AuthMethod" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_spam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_spam" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "transformed_text" TEXT,
    "result" "Result" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_spam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_spam_email_key" ON "user_spam"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_spam_googleId_key" ON "user_spam"("googleId");

-- AddForeignKey
ALTER TABLE "post_spam" ADD CONSTRAINT "post_spam_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_spam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
