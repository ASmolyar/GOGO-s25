#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting animation import migration...${NC}"

# Client-side components
CLIENT_COMPONENTS=(
  "client/src/ImpactReport/components/ArtisticDisciplinesSection.tsx"
  "client/src/ImpactReport/components/AlbumView.tsx"
  "client/src/ImpactReport/components/FutureVisionSection.tsx"
  "client/src/ImpactReport/MusicPage.tsx"
  "client/src/ImpactReport/ImpactReportPage.tsx"
)

# Server-side components
SERVER_COMPONENTS=(
  "src/ImpactReport/ImpactReportPage.tsx"
  "src/ImpactReport/components/HeroSection.tsx"
  "src/ImpactReport/components/ImpactSection.tsx"
)

# Update client-side components
for file in "${CLIENT_COMPONENTS[@]}"
do
  if [ -f "$file" ]; then
    echo -e "${GREEN}Updating${NC} $file"
    # Replace imports from utils/animeWrapper with imports from animations
    sed -i '' 's/import.*from.*utils\/animeWrapper.*/import { animate, stagger } from '\''..\/..\/animations'\'';/g' "$file"
    sed -i '' 's/import.*from.*utils\/animations.*/import { animate, stagger } from '\''..\/..\/animations'\'';/g' "$file"
    sed -i '' 's/import.*from.*utils\/animation.*/import { animate, stagger } from '\''..\/..\/animations'\'';/g' "$file"
    echo "✅ Updated $file"
  else
    echo "⚠️ File $file not found, skipping"
  fi
done

# Update server-side components
for file in "${SERVER_COMPONENTS[@]}"
do
  if [ -f "$file" ]; then
    echo -e "${GREEN}Updating${NC} $file"
    # Replace imports from utils/animation with imports from animations
    sed -i '' 's/import.*from.*utils\/animation.*/import { animate, stagger } from '\''..\/..\/animations'\'';/g' "$file"
    echo "✅ Updated $file"
  else
    echo "⚠️ File $file not found, skipping"
  fi
done

echo -e "${YELLOW}Migration complete!${NC}"
echo "Please manually check the updated files and fix any remaining imports."
echo "Next steps:"
echo "1. Test all animations to ensure they work correctly"
echo "2. Remove old animation files after all components are migrated" 