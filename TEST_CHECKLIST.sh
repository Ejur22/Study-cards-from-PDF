#!/bin/bash
# 🧪 QUICK TESTING GUIDE - StudyCards SEO & Dictionary API

echo "=== SEO Optimization & Dictionary API Testing Guide ==="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: robots.txt
echo -e "${BLUE}[TEST 1]${NC} Testing robots.txt"
echo "Command: curl http://localhost:8000/robots.txt"
echo "Expected: Should return robots.txt content with allow/disallow rules"
echo ""
sleep 2

# Test 2: sitemap.xml  
echo -e "${BLUE}[TEST 2]${NC} Testing sitemap.xml"
echo "Command: curl http://localhost:8000/sitemap.xml"
echo "Expected: Should return XML with URLs and priorities"
echo ""
sleep 2

# Test 3: Dictionary API
echo -e "${BLUE}[TEST 3]${NC} Testing Dictionary API"
echo "Command: curl http://localhost:8000/api/dictionary/word-of-day"
echo "Expected: Should return JSON with word, definition, example, schema"
echo ""
sleep 2

# Test 4: 404 handling
echo -e "${BLUE}[TEST 4]${NC} Testing 404 Error Handling"
echo "Command: curl -i http://localhost:8000/api/nonexistent"
echo "Expected: Should return HTTP 404"
echo ""
sleep 2

# Test 5: Browser test
echo -e "${BLUE}[TEST 5]${NC} Testing Frontend"
echo "Action: Open http://localhost:5173 in browser"
echo "Expected:"
echo "  - Page title should be 'StudyCards - Создавайте тесты из PDF'"
echo "  - Dictionary widget should be visible with word of day"
echo "  - Features section should be below Dictionary widget"
echo ""
sleep 2

# Test 6: Check meta tags
echo -e "${BLUE}[TEST 6]${NC} Checking Meta Tags in Frontend"
echo "Action: Open http://localhost:5173"
echo "Then: Press F12 → Elements → <head>"
echo "Expected to find:"
echo "  - <meta name='description' content='...'>"
echo "  - <meta name='robots' content='index, follow'>"
echo "  - <link rel='canonical' href='...'>"
echo "  - <meta property='og:title' content='...'>"
echo ""
sleep 2

# Test 7: Dictionary widget
echo -e "${BLUE}[TEST 7]${NC} Dictionary Widget Visual Check"
echo "Action: Open http://localhost:5173"
echo "Expected to see:"
echo "  ✓ Gradient purple/pink background"
echo "  ✓ '📖 Слово дня' title"
echo "  ✓ Word name (bold, large)"
echo "  ✓ Part of speech (grey badge)"
echo "  ✓ Definition text"
echo "  ✓ Example quote"
echo "  ✓ Refresh button (🔄) in top-right"
echo ""
sleep 2

# Test 8: Graceful degradation
echo -e "${BLUE}[TEST 8]${NC} Testing Graceful Degradation"
echo "Action: Stop backend (Ctrl+C in uvicorn terminal)"
echo "Then: Refresh http://localhost:5173"
echo "Wait: 5 seconds for timeout"
echo "Expected:"
echo "  ✓ Error message appears ('Словарь временно недоступен')"
echo "  ✓ Retry button is clickable"
echo "  ✓ Page doesn't crash, rest of UI works"
echo "  ✓ Can still upload PDF and use app"
echo ""
sleep 2

# Test 9: Loading skeleton
echo -e "${BLUE}[TEST 9]${NC} Testing Loading State"
echo "Action: Open DevTools Network → Slow 3G"
echo "Then: Refresh http://localhost:5173"
echo "Expected:"
echo "  ✓ Skeleton animation shows while loading"
echo "  ✓ Words appear after data loads"
echo "  ✓ No layout shift when content appears"
echo ""
sleep 2

# Test 10: JSON-LD validation
echo -e "${BLUE}[TEST 10]${NC} JSON-LD Validation"
echo "Action: Open http://localhost:5173"
echo "Then: Press F12 → Elements"
echo "Search: <script type=\"application/ld+json\">"
echo "Expected: Should contain @context, @type, name, description"
echo "Validate at: https://schema.org/DefinedTerm"
echo ""

# DOCKER/PRODUCTION TEST
echo -e "${YELLOW}[OPTIONAL]${NC} Docker/Production Test"
echo "If using Docker Compose:"
echo "  docker-compose up"
echo "Then run same tests but use production URL instead of localhost"
echo ""

# Summary
echo -e "${GREEN}=== ALL TESTS COMPLETED ===${NC}"
echo ""
echo "Summary of what was implemented:"
echo "  ✅ SEO Frontend: Semantic HTML, Meta tags, Dynamic titles"
echo "  ✅ SEO Backend: robots.txt, sitemap.xml, HTTP error handling"
echo "  ✅ Structured Data: JSON-LD for search engines"
echo "  ✅ Performance: Lazy loading, 24-hour cache, optimized payload"
echo "  ✅ API Integration: Dictionary API with graceful degradation"
echo "  ✅ Error Handling: Timeouts, retries, user-friendly messages"
echo ""
echo "Documentation files:"
echo "  📖 SEO_OPTIMIZATION_REPORT.md - Complete technical overview"
echo "  📋 CHANGES_SUMMARY.md - List of all changes"
echo "  ✨ This file - Quick testing guide"
echo ""
