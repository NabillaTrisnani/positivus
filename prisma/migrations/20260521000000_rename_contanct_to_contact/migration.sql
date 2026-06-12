-- Fix typo: the table was created as "Contanct" but the Prisma model is "Contact".
ALTER TABLE "Contanct" RENAME TO "Contact";
ALTER TABLE "Contact" RENAME CONSTRAINT "Contanct_pkey" TO "Contact_pkey";
ALTER SEQUENCE "Contanct_id_seq" RENAME TO "Contact_id_seq";
