-- AlterTable
ALTER TABLE `variant` ADD COLUMN `variantgroupId` INTEGER NULL;

-- AlterTable
ALTER TABLE `variantgroup` ADD COLUMN `productId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `variantgroup` ADD CONSTRAINT `variantgroup_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `variant` ADD CONSTRAINT `variant_variantgroupId_fkey` FOREIGN KEY (`variantgroupId`) REFERENCES `variantgroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
