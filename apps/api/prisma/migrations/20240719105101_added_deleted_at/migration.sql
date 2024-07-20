/*
  Warnings:

  - Added the required column `deletedAt` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Room` ADD COLUMN `deletedAt` DATETIME(3) NOT NULL;
