/*
  Warnings:

  - You are about to drop the `discussions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "discussions" DROP CONSTRAINT "discussions_movie_id_fkey";

-- DropTable
DROP TABLE "discussions";
