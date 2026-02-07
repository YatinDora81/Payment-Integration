-- CreateEnum
CREATE TYPE "GatewayStatus" AS ENUM ('UP', 'DEGRADED', 'DOWN');

-- CreateTable
CREATE TABLE "PaymentGatewayConfig" (
    "id" TEXT NOT NULL,
    "gateway" "PaymentGateway" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "status" "GatewayStatus" NOT NULL DEFAULT 'UP',
    "lastFailureRate" DOUBLE PRECISION,
    "lastEvaluatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentGatewayConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaymentGatewayConfig_enabled_idx" ON "PaymentGatewayConfig"("enabled");

-- CreateIndex
CREATE INDEX "PaymentGatewayConfig_status_idx" ON "PaymentGatewayConfig"("status");

-- CreateIndex
CREATE INDEX "PaymentGatewayConfig_gateway_idx" ON "PaymentGatewayConfig"("gateway");
