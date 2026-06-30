/*
  Warnings:

  - You are about to drop the `Subription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Subription";

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);
