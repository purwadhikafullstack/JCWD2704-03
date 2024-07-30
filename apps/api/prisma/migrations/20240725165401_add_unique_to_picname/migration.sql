/*
  Warnings:

  - A unique constraint covering the columns `[pic_name]` on the table `properties` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pic_name]` on the table `rooms` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[image_name]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `properties_pic_name_key` ON `properties`(`pic_name`);

-- CreateIndex
CREATE UNIQUE INDEX `rooms_pic_name_key` ON `rooms`(`pic_name`);

-- CreateIndex
CREATE UNIQUE INDEX `users_image_name_key` ON `users`(`image_name`);
