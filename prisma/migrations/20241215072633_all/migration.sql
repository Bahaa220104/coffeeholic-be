-- AlterTable
ALTER TABLE `category` ADD COLUMN `type` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `faq` ADD COLUMN `approvedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `email` VARCHAR(191) NULL;
