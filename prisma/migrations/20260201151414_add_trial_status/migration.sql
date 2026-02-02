-- AlterEnum
ALTER TYPE "SubscriptionStatus" ADD VALUE 'TRIAL';

-- AlterTable
ALTER TABLE "offices" ADD COLUMN     "trial_ends_at" TIMESTAMP(3);
