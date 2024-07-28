/*
  Warnings:

  - You are about to drop the column `cityId` on the `properties` table. All the data in the column will be lost.
  - The values [apartment,guesthouse,hotel] on the enum `properties_category` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `City` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `properties` DROP FOREIGN KEY `properties_cityId_fkey`;

-- AlterTable
ALTER TABLE `properties` DROP COLUMN `cityId`,
    MODIFY `category` ENUM('Apartment', 'Guesthouse', 'Hotel') NOT NULL;

-- DropTable
DROP TABLE `City`;
