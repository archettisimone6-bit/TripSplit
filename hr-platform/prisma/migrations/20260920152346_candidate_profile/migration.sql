-- CreateTable
CREATE TABLE "CandidateProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "playsSport" BOOLEAN,
    "sportDetails" TEXT NOT NULL DEFAULT '',
    "hobbies" TEXT NOT NULL DEFAULT '',
    "countriesVisited" TEXT NOT NULL DEFAULT '',
    "iseoFavorite1" TEXT NOT NULL DEFAULT '',
    "iseoFavorite2" TEXT NOT NULL DEFAULT '',
    "iseoFavorite3" TEXT NOT NULL DEFAULT '',
    "manualSkills" TEXT NOT NULL DEFAULT '',
    "manualSkillsIsSatisfying" BOOLEAN,
    "hasDrivingLicenseAndVehicle" BOOLEAN,
    "availableFrom" TEXT NOT NULL DEFAULT '',
    "workPreference" TEXT NOT NULL DEFAULT '',
    "motivation" TEXT NOT NULL DEFAULT '',
    "languages" TEXT NOT NULL DEFAULT '',
    "priorExperience" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "CandidateProfile_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CandidateProfile_applicationId_key" ON "CandidateProfile"("applicationId");
