/*
  Warnings:

  - You are about to drop the column `location` on the `properties` table. All the data in the column will be lost.
  - Added the required column `city` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `properties` DROP COLUMN `location`,
    ADD COLUMN `city` ENUM('jakarta', 'bandung', 'yogyakarta', 'solo', 'semarang', 'surabaya', 'bali', 'makassar', 'manado', 'ambon', 'medan', 'palembang', 'pekanbaru', 'balikpapan', 'banjarmasin', 'pontianak', 'samarinda', 'batam', 'padang', 'malang', 'other') NOT NULL;
