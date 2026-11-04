# ListingForge — AI Multi-Marketplace Product Listing Generator

> Modern SaaS platform that generates high-converting, SEO-optimized, fact-checked product listings for **Amazon**, **Flipkart**, and **Meesho** using Groq AI and n8n workflow automation.

---

## 1. Project Overview

ListingForge solves a major challenge for e-commerce sellers: adapting a single product's specifications into compliant, high-ranking product listings across multiple major marketplaces, each with unique character limits, keyword algorithms, and formatting rules:

- **Amazon (A9 Search Algorithm)**: Strict 200-character title formats, 5 customer-benefit-driven bullet points, backend search terms, and brand capitalization standards.
- **Flipkart**: Conversion-focused feature highlights, technical specifications, and Flipkart Search keyword density.
- **Meesho**: Reseller-friendly selling points, budget-conscious clarity, and trending catalog search tags.

ListingForge couples Groq LLM reasoning with automated factual consistency checks (scoring hallucination risk against input specifications) and calculates an actionable SEO score breakdown.

---

## 2. Technology Stack

### Frontend
- **React 19** & **Vite 6** — Fast modern UI engine and lightning HMR.
- **Tailwind CSS v4** — High-performance utility CSS with dark/light SaaS design inspired by Linear and Stripe.
- **React Router DOM v7** — Declarative SPA routing for Dashboard, Generation, History, Details, and Settings.
- **Axios** — Centralized HTTP client with timeout guards, error parsing, and CORS diagnostics.
- **Lucide React** — Crisp iconography for marketplaces, metrics, and navigation.
- **React Hot Toast** — Non-blocking user feedback for generation, clipboard copying, and deletions.

### Backend & AI Orchestration
- **n8n Cloud Workflows** — Visual automation engine acting as REST API webhooks.
- **Groq AI (Llama 3)** — High-speed LLM inference for multi-marketplace copy generation and fact checking.
- **Google Cloud Firestore** — Cloud NoSQL database storing processed listings and history.
- **Security Rule**: The browser client *never* talks directly to Firebase Firestore or Groq; all requests flow securely through n8n Webhook endpoints.

---

## 3. Application Structure

```
JFP/
├── public/
│   └── logo.svg                 # Application SVG branding
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx      # Navigation sidebar with status badges
│   │   │   ├── Header.jsx       # Theme toggle, live API status, actions
│   │   │   └── Layout.jsx       # Main application layout wrapper
│   │   ├── dashboard/
│   │   │   ├── StatCard.jsx     # Live metric KPI cards
│   │   │   └── ActivityChart.jsx# Channel distribution & SEO performance
│   │   └── listing/
│   │       ├── ProductForm.jsx  # Multi-field form with dynamic features
│   │       ├── MarketplaceSelector.jsx # Channel selection buttons
│   │       ├── MarketplaceCard.jsx     # Copy-ready marketplace card
│   │       ├── ScoreProgress.jsx       # Progress bars & rating tags
│   │       └── AccuracyStatus.jsx      # Hallucination alert indicator
│   ├── pages/
│   │   ├── Dashboard.jsx        # Real statistics, analytics & recent activity
│   │   ├── GenerateListing.jsx  # Generation workspace & outputs
│   │   ├── ListingHistory.jsx   # Archive with search, filters & pagination
│   │   ├── ListingDetails.jsx   # Detailed view for saved listings
│   │   └── Settings.jsx         # Connection diagnostics & workflow guides
│   ├── context/
│   │   └── ThemeContext.jsx     # Dark & Light theme state provider
│   ├── services/
│   │   ├── api.js               # Centralized Axios client & error parser
│   │   ├── listingService.js    # Generation webhook client & normalizer
│   │   └── historyService.js    # Firestore history/details/delete client
│   ├── hooks/
│   │   └── useListings.js       # Generation state hook with duplicate lock
│   ├── utils/
│   │   ├── formatters.js        # Score normalization & copy helpers
│   │   └── validators.js        # Form validation logic
│   ├── App.jsx                  # Main router & toast provider
│   ├── main.jsx                 # React root mount
│   └── index.css                # Tailwind imports & color tokens
├── .env.example                 # Environment template
├── .env                         # Local environment configuration
├── test-verification.mjs        # Automated unit & integration tests
├── package.json
└── vite.config.js
```

---

## 4. Installation & Running Locally

### Prerequisites
- **Node.js** v18+ or v24+
- **npm** v9+

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Ensure your `.env` contains the working listing generation webhook:
```env
VITE_GENERATE_API_URL=https://parvmahajan123.app.n8n.cloud/webhook/listingforge/generate
VITE_HISTORY_API_URL=
VITE_LISTING_DETAILS_API_URL=
VITE_DELETE_LISTING_API_URL=
```

### 3. Run Automated Tests
```bash
npm test
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production
```bash
npm run build
```

---

## 5. Live n8n Generation API Integration

The application connects immediately to the live webhook:
- **Endpoint**: `POST https://parvmahajan123.app.n8n.cloud/webhook/listingforge/generate`
- **Headers**: `Content-Type: application/json`

### Request Body Format:
```json
{
  "product": {
    "name": "Wireless Gaming Mouse",
    "brand": "Logitech",
    "category": "Gaming Accessories",
    "description": "A wired gaming mouse for gaming and everyday use.",
    "features": [
      "6 programmable buttons",
      "RGB lighting",
      "USB wired connectivity",
      "Adjustable DPI",
      "Ergonomic design"
    ]
  },
  "marketplaces": [
    "amazon",
    "flipkart",
    "meesho"
  ]
}
```

### Response Body Format:
```json
{
  "success": true,
  "message": "Listings generated successfully",
  "listings": [
    {
      "marketplace": "amazon",
      "listing": {
        "title": "Logitech Ergonomic Wired Gaming Mouse with 6 Programmable Buttons & Custom RGB Lighting",
        "bullet_points": [
          "PRECISION GAMING SENSOR: Fast tracking with adjustable DPI settings.",
          "PROGRAMMABLE CONTROLS: 6 responsive buttons customized for macro actions.",
          "DYNAMIC RGB: Multi-zone lighting customizable via companion software.",
          "WIRED RELIABILITY: Zero-lag USB wired connection ensures instant response.",
          "COMFORT DESIGN: Ergonomic sculpted body designed for long gaming sessions."
        ],
        "description": "Dominate your favorite games with the Logitech Wired Gaming Mouse...",
        "seo_keywords": ["gaming mouse", "wired gaming mouse", "rgb mouse", "logitech mouse"],
        "search_tags": ["pcmouse", "gaminggear", "logitechgaming"]
      },
      "seo_score": 88,
      "seo_score_breakdown": {
        "title_relevance": 90,
        "bullet_quality": 85,
        "keyword_coverage": 88
      },
      "accuracy_passed": true,
      "accuracy_score": 100,
      "accuracy_issues": []
    }
  ]
}
```

---

## 6. Firestore Backend Workflows (n8n Setup Guide)

Your existing n8n workflow already creates documents in Firebase Cloud Firestore during listing generation. To integrate persistent listing history, detailed retrieval, and deletion, configure the following three workflows in n8n Cloud:

### Workflow 1: GET Listing History (`GET /history`)
1. Create a new n8n workflow: **ListingForge - History Fetcher**.
2. **Webhook Node**:
   - HTTP Method: `GET`
   - Path: `listingforge/history`
   - In **Options**, click **Add Option** → **Allowed Origins (CORS)** → enter `*`.
3. **Firestore Node**:
   - Resource: `Document`
   - Operation: `Get Many / Query`
   - Collection: `listings` (or your collection name)
   - Order By: `created_at` (Descending)
   - Limit: `50`
4. **Respond to Webhook Node**:
   - Respond With: `JSON`
   - Response Body: `{{ { success: true, listings: $json } }}`
   - Response Headers: `Access-Control-Allow-Origin: *`
5. Activate the workflow and paste the production URL into `.env`:
   ```env
   VITE_HISTORY_API_URL=https://parvmahajan123.app.n8n.cloud/webhook/listingforge/history
   ```

---

### Workflow 2: GET Listing Details (`GET /history/:id`)
1. Create a new n8n workflow: **ListingForge - Get Single Listing**.
2. **Webhook Node**:
   - HTTP Method: `GET`
   - Path: `listingforge/details`
   - Options: Set **Allowed Origins (CORS)** to `*`.
3. **Firestore Node**:
   - Operation: `Get`
   - Document Path: `listings/{{ $query.id }}`
4. **Respond to Webhook Node**:
   - Respond With: `JSON`
   - Response Body: `{{ { success: true, listing: $json } }}`
   - Response Headers: `Access-Control-Allow-Origin: *`
5. Set in `.env`:
   ```env
   VITE_LISTING_DETAILS_API_URL=https://parvmahajan123.app.n8n.cloud/webhook/listingforge/details
   ```

---

### Workflow 3: DELETE Listing (`DELETE /history/:id`)
1. Create a new n8n workflow: **ListingForge - Delete Listing**.
2. **Webhook Node**:
   - HTTP Method: `DELETE`
   - Path: `listingforge/delete`
   - Options: Set **Allowed Origins (CORS)** to `*`.
3. **Firestore Node**:
   - Operation: `Delete`
   - Document Path: `listings/{{ $query.id }}`
4. **Respond to Webhook Node**:
   - Respond With: `JSON`
   - Response Body: `{{ { success: true, message: "Listing deleted from Firestore" } }}`
   - Response Headers: `Access-Control-Allow-Origin: *`
5. Set in `.env`:
   ```env
   VITE_DELETE_LISTING_API_URL=https://parvmahajan123.app.n8n.cloud/webhook/listingforge/delete
   ```

---

## 7. CORS Configuration in n8n Cloud

When calling n8n webhooks from a browser client (e.g. `http://localhost:5173`), the browser issues a preflight `OPTIONS` request.

To ensure your webhooks accept browser requests:
1. In each n8n Webhook node, open **Options** → click **Add Option** → choose **Allowed Origins (CORS)**.
2. Enter `*` (or your frontend origin: `http://localhost:5173`).
3. In the **Respond to Webhook** node, add the response header:
   - Name: `Access-Control-Allow-Origin`
   - Value: `*`
4. Toggle the workflow to **Active**.

---

## 8. Security & Best Practices

- **Zero Client-Side Credentials**: Firebase service accounts, Google OAuth tokens, and Groq API keys remain strictly inside your private n8n Cloud credentials store.
- **Client Normalization**: Scores and validation states are normalized on ingestion (`Number(score) || 0`) so inconsistent data formats never crash the UI.
- **Duplicate Prevention**: Buttons and forms feature submission locks to avoid duplicate AI requests.
- **Graceful Session Fallback**: If backend history webhooks are not yet active, recent listings are stored in client session storage so users can immediately test all dashboard and history functionality.
