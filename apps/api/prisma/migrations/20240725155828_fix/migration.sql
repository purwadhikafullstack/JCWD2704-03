-- AlterTable
ALTER TABLE `orders` ADD COLUMN `payment_method` ENUM('BCA', 'MANDIRI') NULL;
