-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "location" TEXT,
    "url" TEXT,
    "salary" TEXT,
    "modality" TEXT,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "appliedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StageEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "jobId" TEXT NOT NULL,
    CONSTRAINT "StageEntry_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "JobApplication" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
