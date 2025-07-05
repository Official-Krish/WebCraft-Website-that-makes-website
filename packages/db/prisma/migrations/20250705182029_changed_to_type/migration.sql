/*
  Warnings:

  - You are about to drop the column `description` on the `Action` table. All the data in the column will be lost.
  - Added the required column `type` to the `Action` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('FILE', 'COMMAND', 'MESSAGE');

-- AlterTable
ALTER TABLE "Action" DROP COLUMN "description",
ADD COLUMN     "type" "ActionType" NOT NULL;
