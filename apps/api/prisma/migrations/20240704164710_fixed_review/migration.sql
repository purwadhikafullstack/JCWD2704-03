/*
  Warnings:

  - You are about to drop the column `userId` on the `reviews` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_user_id_fkey`;

-- AlterTable
ALTER TABLE `reviews` DROP COLUMN `userId`,
    MODIFY `user_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
