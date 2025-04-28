/*
  Warnings:

  - You are about to drop the column `job` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `job`,
    DROP COLUMN `website`,
    ADD COLUMN `rank` VARCHAR(191) NULL,
    ADD COLUMN `role` ENUM('DUELIST', 'VANGUARD', 'STRATEGIST') NULL;
