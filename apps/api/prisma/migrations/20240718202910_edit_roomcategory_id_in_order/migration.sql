/*
  Warnings:

  - You are about to drop the column `roomCategoryId` on the `orders` table. All the data in the column will be lost.
  - Added the required column `roomCategory_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_roomCategoryId_fkey`;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `roomCategoryId`,
    ADD COLUMN `roomCategory_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_roomCategory_id_fkey` FOREIGN KEY (`roomCategory_id`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
