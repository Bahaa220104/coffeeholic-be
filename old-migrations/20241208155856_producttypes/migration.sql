/*
  Warnings:

  - The primary key for the `producttype` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `producttype` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `producttype` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `producttype` table. All the data in the column will be lost.
  - You are about to drop the column `sequenceNumber` on the `producttype` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `producttype` table. All the data in the column will be lost.
  - Made the column `name` on table `producttype` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `_producttoproducttype` DROP FOREIGN KEY `_productToproducttype_B_fkey`;

-- AlterTable
ALTER TABLE `_producttoproducttype` MODIFY `B` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `producttype` DROP PRIMARY KEY,
    DROP COLUMN `createdAt`,
    DROP COLUMN `deletedAt`,
    DROP COLUMN `id`,
    DROP COLUMN `sequenceNumber`,
    DROP COLUMN `updatedAt`,
    MODIFY `name` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`name`);

-- AddForeignKey
ALTER TABLE `_productToproducttype` ADD CONSTRAINT `_productToproducttype_B_fkey` FOREIGN KEY (`B`) REFERENCES `producttype`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;
