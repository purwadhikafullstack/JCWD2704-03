-- AlterTable
ALTER TABLE `properties` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `rooms` ADD COLUMN `deletedAt` DATETIME(3) NULL;
