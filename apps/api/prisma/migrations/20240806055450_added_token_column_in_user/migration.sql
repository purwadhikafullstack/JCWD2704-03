-- AlterTable
ALTER TABLE `users` ADD COLUMN `tokenExpiration` DATETIME(3) NULL,
    ADD COLUMN `verificationToken` VARCHAR(191) NULL;
