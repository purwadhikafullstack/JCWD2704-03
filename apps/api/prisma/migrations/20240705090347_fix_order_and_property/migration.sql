/*
  Warnings:

  - You are about to drop the column `city` on the `properties` table. All the data in the column will be lost.
  - The values [villa] on the enum `properties_category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `payment_date` DATETIME(3) NULL,
    MODIFY `payment_proof` LONGBLOB NULL;

-- AlterTable
ALTER TABLE `properties` DROP COLUMN `city`,
    ADD COLUMN `city_id` VARCHAR(191) NULL,
    MODIFY `category` ENUM('apartment', 'guesthouse', 'hotel') NOT NULL;

-- CreateTable
CREATE TABLE `City` (
    `id` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `properties` ADD CONSTRAINT `properties_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `City`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
