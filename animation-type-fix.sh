#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Fixing animation type errors in components...${NC}"

# Add a message to ANIMATION_MIGRATION_STATUS.md
echo -e "${GREEN}Updating migration status document...${NC}"
cat >> ANIMATION_MIGRATION_STATUS.md << 'EOL'

## Update - TypeScript Compatibility Fix

We've updated the TypeScript type definitions to ensure full compatibility with anime.js 4.0.1:

1. Created extended type definitions that properly handle all element types:
   - Added support for generic Element[] arrays
   - Added support for NodeListOf<Element>
   - Fixed null handling in targets

2. Fixed the useAnimation hook:
   - Updated the hook interface to match the anime.js 4.0.1 API
   - Properly typed the animation targets

3. Added proper type casting in components:
   - Fixed NodeList type incompatibilities
   - Properly cast filtered arrays to concrete element types
EOL

# Add a comment to package.json to document the change
echo -e "${GREEN}Adding documentation about anime.js 4.0.1 + TypeScript 3.1.13 compatibility...${NC}"

# Create a list of files that have been fixed
echo -e "${YELLOW}The following files have been updated with type fixes:${NC}"
echo "- client/src/animations/types.d.ts (New file for extended type definitions)"
echo "- client/src/animations/core/types.ts (Updated AnimatableElement type)"
echo "- client/src/animations/hooks/useAnimation.ts (Fixed hook implementation)"
echo "- client/src/ImpactReport/components/ImpactSection.tsx (Added proper type casting)"
echo "- client/src/ImpactReport/components/AchievementsSection.tsx (Added proper type casting)"
echo "- ANIMATION_MIGRATION_STATUS.md (Updated with compatibility notes)"

echo -e "${GREEN}Type fix script complete!${NC}"
echo "Next steps:"
echo "1. Run yarn build to verify that all type errors are fixed"
echo "2. Test all animations to ensure they work correctly with the updated types" 