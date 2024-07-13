/*
  Warnings:

  - The values [standard,deluxe,suite] on the enum `rooms_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `rooms` MODIFY `type` ENUM('Standard', 'Deluxe', 'Suite') NOT NULL;
