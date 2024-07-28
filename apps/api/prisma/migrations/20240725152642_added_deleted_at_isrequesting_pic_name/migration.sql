/*
  Warnings:

  - Added the required column `updatedAt` to the `OrderRoom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `OrderRoom` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Room` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `properties` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `pic_name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `rooms` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `pic_name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `image_name` VARCHAR(191) NULL,
    ADD COLUMN `isRequestingEmailChange` BOOLEAN NULL DEFAULT false;
