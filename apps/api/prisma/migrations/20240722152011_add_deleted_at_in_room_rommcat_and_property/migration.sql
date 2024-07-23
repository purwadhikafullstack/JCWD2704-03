-- AlterTable
ALTER TABLE `orders` ADD COLUMN `deleteAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `properties` ADD COLUMN `deleteAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `room` ADD COLUMN `deleteAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `rooms` ADD COLUMN `deleteAt` DATETIME(3) NULL;
