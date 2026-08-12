-- AlterTable
ALTER TABLE "Submission" ALTER COLUMN "filmUrl" DROP NOT NULL;
ALTER TABLE "Submission" ADD COLUMN     "shippingAddressLine1" TEXT;
ALTER TABLE "Submission" ADD COLUMN     "shippingAddressLine2" TEXT;
ALTER TABLE "Submission" ADD COLUMN     "shippingCity" TEXT;
ALTER TABLE "Submission" ADD COLUMN     "shippingState" TEXT;
ALTER TABLE "Submission" ADD COLUMN     "shippingPostalCode" TEXT;
ALTER TABLE "Submission" ADD COLUMN     "shippingCountry" TEXT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "shippingName";
ALTER TABLE "Order" DROP COLUMN "shippingAddressLine1";
ALTER TABLE "Order" DROP COLUMN "shippingAddressLine2";
ALTER TABLE "Order" DROP COLUMN "shippingCity";
ALTER TABLE "Order" DROP COLUMN "shippingState";
ALTER TABLE "Order" DROP COLUMN "shippingPostalCode";
ALTER TABLE "Order" DROP COLUMN "shippingCountry";
ALTER TABLE "Order" DROP COLUMN "isRestring";
