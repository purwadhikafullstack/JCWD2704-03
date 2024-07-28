-- AlterTable
ALTER TABLE `orders` MODIFY `payment_method` ENUM('BCA', 'MANDIRI', 'gopay', 'qris') NULL;
