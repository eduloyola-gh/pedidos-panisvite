-- CreateTable
CREATE TABLE "AppSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "freeShippingThreshold" REAL NOT NULL DEFAULT 50.0,
    "updatedAt" DATETIME NOT NULL
);
