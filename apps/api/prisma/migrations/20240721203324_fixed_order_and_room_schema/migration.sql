/*
  Warnings:

  - You are about to drop the column `roomCategoryId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `room_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `total_room` on the `orders` table. All the data in the column will be lost.
  - Added the required column `roomCategory_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_roomCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_room_id_fkey`;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `roomCategoryId`,
    DROP COLUMN `room_id`,
    DROP COLUMN `total_room`,
    ADD COLUMN `roomCategory_id` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `OrderRoom` (
    `id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `room_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_roomCategory_id_fkey` FOREIGN KEY (`roomCategory_id`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderRoom` ADD CONSTRAINT `OrderRoom_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderRoom` ADD CONSTRAINT `OrderRoom_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
