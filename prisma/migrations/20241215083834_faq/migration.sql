-- AlterTable
ALTER TABLE `faq` ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `faq` ADD CONSTRAINT `faq_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
