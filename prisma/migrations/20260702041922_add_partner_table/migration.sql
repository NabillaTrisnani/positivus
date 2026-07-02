/*
  Warnings:

  - You are about to drop the column `image` on the `Partner` table. All the data in the column will be lost.
  - Added the required column `logo` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Partner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Partner" DROP COLUMN "image",
ADD COLUMN     "logo" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
