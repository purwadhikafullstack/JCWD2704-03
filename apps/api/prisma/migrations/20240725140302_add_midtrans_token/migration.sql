-- AlterTable
ALTER TABLE `orders` ADD COLUMN `token_midTrans` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `properties` ADD COLUMN `pic_name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `rooms` ADD COLUMN `pic_name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `image_name` VARCHAR(191) NULL,
    ADD COLUMN `isRequestingEmailChange` BOOLEAN NULL DEFAULT false;
