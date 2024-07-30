/*
  Warnings:

  - You are about to drop the column `room_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `total_room` on the `orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_room_id_fkey`;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `room_id`,
    DROP COLUMN `total_room`;

-- CreateTable
CREATE TABLE `OrderRoom` (
    `id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `room_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OrderRoom` ADD CONSTRAINT `OrderRoom_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderRoom` ADD CONSTRAINT `OrderRoom_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
