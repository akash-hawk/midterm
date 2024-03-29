/*
  Warnings:

  - Added the required column `director` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "director" TEXT NOT NULL,
ADD COLUMN     "genre" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "release_year" INTEGER,
ADD COLUMN     "updated_at" TIMESTAMP(3);
