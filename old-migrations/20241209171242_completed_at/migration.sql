/*
  Warnings:

  - You are about to alter the column `time` on the `order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `completedAt` DATETIME(3) NULL,
    MODIFY `time` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `reservation` ADD COLUMN `completedAt` DATETIME(3) NULL;
