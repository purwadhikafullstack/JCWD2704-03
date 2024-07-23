/*
  Warnings:

  - You are about to drop the column `deleteAt` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `deleteAt` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the `orderroom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `room` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `orderroom` DROP FOREIGN KEY `OrderRoom_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `room` DROP FOREIGN KEY `Room_property_id_fkey`;

-- DropForeignKey
ALTER TABLE `room` DROP FOREIGN KEY `Room_roomCategory_id_fkey`;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `deleteAt`;

-- AlterTable
ALTER TABLE `properties` DROP COLUMN `deleteAt`;

-- DropTable
DROP TABLE `orderroom`;

-- DropTable
DROP TABLE `room`;

-- CreateTable
CREATE TABLE `Room` (
    `id` VARCHAR(191) NOT NULL,
    `roomCategory_id` VARCHAR(191) NOT NULL,
    `property_id` VARCHAR(191) NOT NULL,
    `deleteAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderRoom` (
    `id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `room_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_roomCategory_id_fkey` FOREIGN KEY (`roomCategory_id`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderRoom` ADD CONSTRAINT `OrderRoom_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderRoom` ADD CONSTRAINT `OrderRoom_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
