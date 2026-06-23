/*
  Warnings:

  - Made the column `embedding` on table `DocumentChunk` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DocumentChunk" ALTER COLUMN "embedding" SET NOT NULL;
