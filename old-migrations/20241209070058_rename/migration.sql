/*
  Warnings:

  - You are about to drop the column `variantgroupId` on the `variant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `variant` DROP FOREIGN KEY `variant_variantgroupId_fkey`;

-- AlterTable
ALTER TABLE `variant` DROP COLUMN `variantgroupId`,
    ADD COLUMN `variantGroupId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `variant` ADD CONSTRAINT `variant_variantGroupId_fkey` FOREIGN KEY (`variantGroupId`) REFERENCES `variantgroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
