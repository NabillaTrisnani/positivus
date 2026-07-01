/*
  Warnings:

  - You are about to drop the column `image` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Service` table. All the data in the column will be lost.
  - Added the required column `buttonFontColor` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buttonIconColor` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cardBackground` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `headerBackgroundColor` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `headerText` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `headerTextColor` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceIllustration` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "image",
DROP COLUMN "name",
ADD COLUMN     "buttonFontColor" TEXT NOT NULL,
ADD COLUMN     "buttonIconColor" TEXT NOT NULL,
ADD COLUMN     "cardBackground" TEXT NOT NULL,
ADD COLUMN     "headerBackgroundColor" TEXT NOT NULL,
ADD COLUMN     "headerText" TEXT NOT NULL,
ADD COLUMN     "headerTextColor" TEXT NOT NULL,
ADD COLUMN     "serviceIllustration" TEXT NOT NULL;
