-- AlterTable
ALTER TABLE `orders` ADD COLUMN `token_midTrans` VARCHAR(191) NULL,
    MODIFY `payment_method` ENUM('BCA', 'MANDIRI') NULL;
