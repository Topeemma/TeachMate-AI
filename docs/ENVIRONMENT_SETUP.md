# TeachMate AI — Environment & Secrets Setup Guide

TeachMate AI features a resilient multi-provider environment configuration layer. Secret keys are strictly managed on the server backend and **never exposed to the client browser bundle**.

---

## Required & Optional Environment Variables

Create a `.env` file in the project root (or configure variables via the AI Studio Secrets menu):

```env
# GEMINI_API_KEY: Required for Gemini 3.6 Flash lesson package generation & multi-agent reasoning.
GEMINI_API_KEY="your_gemini_api_key_here"

# PIXVERSE_API_KEY: Used for generating 15-second AI topic videos.
PIXVERSE_API_KEY="your_pixverse_api_key_here"

# PADI_API_KEY: Reserved optional provider for extended multi-minute video generation.
PADI_API_KEY="your_padi_api_key_here"
```

---

## How to Obtain Keys

### 1. Gemini API Key (`GEMINI_API_KEY`)
- Visit [Google AI Studio](https://aistudio.google.com/)
- Click **Get API key** and create a key in your GCP project.
- Paste the key into `GEMINI_API_KEY` or configure it in AI Studio Secrets.

### 2. Pixverse API Key (`PIXVERSE_API_KEY`)
- Register at [Pixverse AI Portal](https://pixverse.ai/)
- Generate an API Key under developer settings.
- If unconfigured, TeachMate AI seamlessly switches to the built-in animated canvas topic stream fallback.

### 3. PADI API Key (`PADI_API_KEY`)
- Reserved provider for secondary video extension clips. Leave blank or unconfigured unless utilizing extended video generation services.

---

## Client Bundle Security Verification

TeachMate AI adheres strictly to secret isolation security standards:
1. Secret keys are only accessed inside server-side code (`server.ts`, `server/config.ts`).
2. No secret key variable is prefixed with `VITE_`.
3. Running a search/grep across the compiled client production bundle confirms zero occurrences of any secret API keys.
