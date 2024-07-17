/*
  Warnings:

  - You are about to drop the column `availability` on the `rooms` table. All the data in the column will be lost.
  - The values [Suite] on the enum `rooms_type` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `bed` to the `rooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isBreakfast` to the `rooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isRefunable` to the `rooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isSmoking` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_room_id_fkey`;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `cancel_date` DATETIME(3) NULL,
    ADD COLUMN `roomCategoryId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `rooms` DROP COLUMN `availability`,
    ADD COLUMN `bed` ENUM('king', 'twin', 'single') NOT NULL,
    ADD COLUMN `isBreakfast` BOOLEAN NOT NULL,
    ADD COLUMN `isRefunable` BOOLEAN NOT NULL,
    ADD COLUMN `isSmoking` BOOLEAN NOT NULL,
    MODIFY `type` ENUM('Standard', 'Deluxe') NOT NULL;

-- CreateTable
CREATE TABLE `Room` (
    `id` VARCHAR(191) NOT NULL,
    `roomCategory_id` VARCHAR(191) NOT NULL,
    `property_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_roomCategory_id_fkey` FOREIGN KEY (`roomCategory_id`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_roomCategoryId_fkey` FOREIGN KEY (`roomCategoryId`) REFERENCES `rooms`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
