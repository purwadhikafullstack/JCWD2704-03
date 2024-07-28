/*
  Warnings:

  - You are about to drop the column `city_id` on the `properties` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `properties` DROP FOREIGN KEY `properties_city_id_fkey`;

-- AlterTable
ALTER TABLE `properties` DROP COLUMN `city_id`,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `cityId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `properties` ADD CONSTRAINT `properties_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
