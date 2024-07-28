/*
  Warnings:

  - You are about to drop the column `guest` on the `orders` table. All the data in the column will be lost.
  - Added the required column `guest` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` DROP COLUMN `guest`;

-- AlterTable
ALTER TABLE `rooms` ADD COLUMN `guest` INTEGER NOT NULL;
