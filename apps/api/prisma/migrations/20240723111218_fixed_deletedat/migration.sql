/*
  Warnings:

  - You are about to drop the column `deleteAt` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `deleteAt` on the `rooms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Room` DROP COLUMN `deleteAt`,
    ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `rooms` DROP COLUMN `deleteAt`;
