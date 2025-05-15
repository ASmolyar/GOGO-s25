#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Fixing animation imports in ImpactReport components...${NC}"

# Fix client-side imports
CLIENT_FILES=(
  "client/src/ImpactReport/components/ImpactSection.tsx"
  "client/src/ImpactReport/components/ProgramsSection.tsx"
  "client/src/ImpactReport/components/ArtisticDisciplinesSection.tsx"
  "client/src/ImpactReport/components/HeroSection.tsx"
  "client/src/ImpactReport/components/MusicLibrary.tsx"
  "client/src/ImpactReport/components/AchievementsSection.tsx"
  "client/src/ImpactReport/components/Modal.tsx"
  "client/src/ImpactReport/components/FutureVisionSection.tsx"
  "client/src/ImpactReport/components/AlbumView.tsx"
  "client/src/ImpactReport/ImpactReportPage.tsx"
)

for file in "${CLIENT_FILES[@]}"
do
  if [ -f "$file" ]; then
    echo -e "${GREEN}Updating${NC} $file"
    # Replace any imports from ../ with ./
    sed -i '' 's|from '\''../animations'\''|from '\''../animations'\''|g' "$file"
    # Replace any imports from ../../animations with ../animations
    sed -i '' 's|from '\''../../animations'\''|from '\''../animations'\''|g' "$file"
    echo "✅ Updated $file"
  else
    echo "⚠️ File $file not found, skipping"
  fi
done

# Fix server-side imports (if they exist)
SERVER_FILES=(
  "src/ImpactReport/components/HeroSection.tsx"
  "src/ImpactReport/components/ImpactSection.tsx"
  "src/ImpactReport/ImpactReportPage.tsx"
)

echo -e "${YELLOW}Checking server-side components...${NC}"
for file in "${SERVER_FILES[@]}"
do
  if [ -f "$file" ]; then
    echo -e "${GREEN}Updating${NC} $file"
    # Replace imports from ../../animations with proper server path (may need adjustment)
    sed -i '' 's|from '\''../../animations'\''|from '\''../animations'\''|g' "$file"
    echo "✅ Updated $file"
  else
    echo "ℹ️ File $file not found, skipping (this is normal if server doesn't use animations)"
  fi
done

echo -e "${GREEN}Import path fixes complete!${NC}"
echo "You should now run 'yarn build' to verify that all import errors are fixed." 