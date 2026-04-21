-- CreateTable
CREATE TABLE "AboutSection" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "quoteEn" TEXT NOT NULL DEFAULT '',
    "quoteAr" TEXT NOT NULL DEFAULT '',
    "drNameEn" TEXT NOT NULL DEFAULT '',
    "drNameAr" TEXT NOT NULL DEFAULT '',
    "drTitleEn" TEXT NOT NULL DEFAULT '',
    "drTitleAr" TEXT NOT NULL DEFAULT '',
    "stat1Value" TEXT NOT NULL DEFAULT '',
    "stat1LabelEn" TEXT NOT NULL DEFAULT '',
    "stat1LabelAr" TEXT NOT NULL DEFAULT '',
    "stat2Value" TEXT NOT NULL DEFAULT '',
    "stat2LabelEn" TEXT NOT NULL DEFAULT '',
    "stat2LabelAr" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutSection_pkey" PRIMARY KEY ("id")
);
