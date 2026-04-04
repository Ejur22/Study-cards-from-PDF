#!/bin/bash
# 🧪 CURL TESTING COMMANDS - Copy & Paste Ready

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                  SEO & API TESTING COMMANDS                   ║${NC}"
echo -e "${BLUE}║              Copy each command and run in terminal            ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Test 1: Check if backend is running
echo -e "${YELLOW}[TEST 1] Check Backend Status${NC}"
echo -e "Command:"
echo "  curl -i http://localhost:8000/"
echo -e "\nExpected Response: ${GREEN}HTTP/1.1 200 OK${NC}"
echo "Expected Body: JSON with API info"
echo ""
sleep 1

# Test 2: Get robots.txt
echo -e "${YELLOW}[TEST 2] Content of robots.txt${NC}"
echo -e "Command:"
echo "  curl http://localhost:8000/robots.txt"
echo -e "\nExpected: ${GREEN}Text content with URLs and rules${NC}"
echo "Should include:"
echo "  - Allow: /"
echo "  - Allow: /api/dictionary/"
echo "  - Disallow: /api/groups/"
echo "  - Sitemap: https://studycards.app/sitemap.xml"
echo ""
sleep 1

# Test 3: Get sitemap.xml
echo -e "${YELLOW}[TEST 3] Content of sitemap.xml${NC}"
echo -e "Command:"
echo "  curl http://localhost:8000/sitemap.xml"
echo -e "\nExpected: ${GREEN}XML content with URLs${NC}"
echo "Should include:"
echo "  - <url><loc>https://studycards.app/</loc>..."
echo "  - priority 1.0 for homepage"
echo "  - priority 0.8 for dictionary API"
echo ""
sleep 1

# Test 4: Get word of day with full output
echo -e "${YELLOW}[TEST 4] Get Word of Day (Full Response)${NC}"
echo -e "Command:"
echo "  curl -s http://localhost:8000/api/dictionary/word-of-day | jq"
echo -e "\nAlternatively (pretty print):"
echo "  curl -s http://localhost:8000/api/dictionary/word-of-day | python -m json.tool"
echo -e "\nExpected: ${GREEN}JSON object:${NC}"
echo "  {"
echo "    \"word\": \"Синергия\","
echo "    \"definition\": \"...\","
echo "    \"example\": \"...\","
echo "    \"part_of_speech\": \"существительное\","
echo "    \"schema\": { @context, @type, name, description }"
echo "  }"
echo ""
sleep 1

# Test 5: Search specific word
echo -e "${YELLOW}[TEST 5] Search for Specific Word${NC}"
echo -e "Command:"
echo "  curl http://localhost:8000/api/dictionary/search/Синергия"
echo -e "\nOr (URL encoded):"
echo "  curl 'http://localhost:8000/api/dictionary/search/Syndashfdhsdgh'"
echo -e "\nExpected: ${GREEN}404 or word data${NC}"
echo ""
sleep 1

# Test 6: Check headers
echo -e "${YELLOW}[TEST 6] Response Headers${NC}"
echo -e "Command:"
echo "  curl -i http://localhost:8000/api/dictionary/word-of-day"
echo -e "\nExpected: ${GREEN}Headers including:${NC}"
echo "  HTTP/1.1 200 OK"
echo "  Content-Type: application/json"
echo "  Date: ..."
echo ""
sleep 1

# Test 7: Test 404 error
echo -e "${YELLOW}[TEST 7] Test 404 Error Handling${NC}"
echo -e "Command:"
echo "  curl -i http://localhost:8000/api/nonexistent"
echo -e "\nExpected: ${GREEN}HTTP/1.1 404 Not Found${NC}"
echo "Body: {"
echo "  \"detail\": \"Страница не найдена\","
echo "  \"path\": \"/api/nonexistent\""
echo "}"
echo ""
sleep 1

# Test 8: Test with timeout
echo -e "${YELLOW}[TEST 8] Test Response Time${NC}"
echo -e "Command (with timing):"
echo "  curl -w '\\nTime: %{time_total}s\\n' http://localhost:8000/api/dictionary/word-of-day"
echo -e "\nExpected: ${GREEN}Response in < 1 second${NC}"
echo ""
sleep 1

# Test 9: Test with custom headers
echo -e "${YELLOW}[TEST 9] Add Custom Headers${NC}"
echo -e "Command:"
echo "  curl -H 'User-Agent: SEOBot/1.0' http://localhost:8000/robots.txt"
echo -e "\nExpected: ${GREEN}Same response regardless of User-Agent${NC}"
echo ""
sleep 1

# Test 10: Batch test all endpoints
echo -e "${YELLOW}[TEST 10] Quick Batch Test${NC}"
echo -e "Command:"
cat << 'EOF'
  echo "Testing all endpoints..."
  echo "1. Root:"
  curl -s http://localhost:8000/ | jq '.message'
  echo ""
  echo "2. robots.txt:"
  curl -s http://localhost:8000/robots.txt | head -3
  echo ""
  echo "3. sitemap.xml:"
  curl -s http://localhost:8000/sitemap.xml | grep -m1 'loc'
  echo ""
  echo "4. Dictionary API:"
  curl -s http://localhost:8000/api/dictionary/word-of-day | jq '.word'
EOF
echo ""

# FRONTEND TESTS
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    FRONTEND TESTS                             ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Test 11: Get HTML
echo -e "${YELLOW}[TEST 11] Check Frontend HTML (Meta Tags)${NC}"
echo -e "Command:"
echo "  curl http://localhost:5173 | grep '<meta'"
echo -e "\nExpected: ${GREEN}Multiple meta tags${NC}"
echo "  - <meta name=\"description\" content=\"...\">"
echo "  - <meta name=\"robots\" content=\"index, follow\">"
echo "  - <meta property=\"og:title\" content=\"...\">"
echo "  - <link rel=\"canonical\" href=\"...\">"
echo ""
sleep 1

# Test 12: Check specific meta tag
echo -e "${YELLOW}[TEST 12] Check Title Tag${NC}"
echo -e "Command:"
echo "  curl http://localhost:5173 | grep '<title'"
echo -e "\nExpected:"
echo "  <title>StudyCards - Создавайте тесты из PDF</title>"
echo ""
sleep 1

# Test 13: JSON-LD validation
echo -e "${YELLOW}[TEST 13] Check JSON-LD in HTML${NC}"
echo -e "Command:"
echo "  curl http://localhost:5173 | grep -A 6 'application/ld+json'"
echo -e "\nExpected: ${GREEN}JSON-LD script tag with DefinedTerm${NC}"
echo ""

# ADVANCED TESTS
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    ADVANCED TESTS                             ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Test 14: Load testing
echo -e "${YELLOW}[TEST 14] Load Test (Multiple Requests)${NC}"
echo -e "Command:"
echo "  for i in {1..10}; do curl -s http://localhost:8000/api/dictionary/word-of-day > /dev/null; done; echo 'Completed 10 requests'"
echo -e "\nExpected: ${GREEN}All requests complete successfully${NC}"
echo ""

# Test 15: Cache validation
echo -e "${YELLOW}[TEST 15] Verify Caching (Same Word on Multiple Requests)${NC}"
echo -e "Command:"
echo "  curl -s http://localhost:8000/api/dictionary/word-of-day | jq '.word'"
echo "  # Run again:"
echo "  curl -s http://localhost:8000/api/dictionary/word-of-day | jq '.word'"
echo -e "\nExpected: ${GREEN}Same word returned (from cache)${NC}"
echo ""

# DOCKER TESTS (optional)
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    DOCKER TESTS (Optional)                    ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}[TEST 16] Docker/Production URL Testing${NC}"
echo -e "If using Docker Compose, update URLs:"
echo "  Replace: http://localhost:8000"
echo "  With: https://yourdomain.com"
echo ""
echo "Then run same commands as above with production URL"
echo ""

# Summary section
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                       SUMMARY                                 ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ All Tests Passing Criteria:${NC}"
echo ""
echo "Backend Tests (localhost:8000):"
echo "  ✓ / returns 200 with API info"
echo "  ✓ /robots.txt returns text/plain with crawl rules"
echo "  ✓ /sitemap.xml returns application/xml with URLs"
echo "  ✓ /api/dictionary/word-of-day returns JSON with schema"
echo "  ✓ /nonexistent returns 404 status code"
echo "  ✓ Response time < 1 second"
echo "  ✓ Cache works (same word returned on 2nd request)"
echo ""
echo "Frontend Tests (localhost:5173):"
echo "  ✓ Page loads with all meta tags"
echo "  ✓ <title> is correct"
echo "  ✓ <meta name='description'> exists"
echo "  ✓ <meta name='robots'> is 'index, follow'"
echo "  ✓ <link rel='canonical'> points to domain"
echo "  ✓ <meta property='og:*'> tags present"
echo "  ✓ JSON-LD <script> tag exists with valid JSON"
echo ""
echo -e "${GREEN}✅ If all tests pass, implementation is complete!${NC}"
echo ""

# Troubleshooting
echo -e "${YELLOW}Troubleshooting:${NC}"
echo ""
echo -e "${RED}Connection refused?${NC}"
echo "  • Make sure backend is running: uvicorn app.main:app --reload"
echo "  • Make sure frontend is running: npm run dev"
echo ""
echo -e "${RED}404 on /robots.txt?${NC}"
echo "  • Check that public.py router is imported in main.py"
echo "  • Verify app.include_router(public.router) exists"
echo ""
echo -e "${RED}Empty Dictionary response?${NC}"
echo "  • Check dictionary_service.py exists in services folder"
echo "  • Look for import errors in app logs"
echo ""
echo -e "${RED}SEO tags missing in HTML?${NC}"
echo "  • Check HelmetProvider wraps app in main.jsx"
echo "  • Verify SEOHead component is mounted"
echo "  • Check browser DevTools → Elements tab"
echo ""

echo -e "${GREEN}Done! 🎉${NC}"
echo ""
