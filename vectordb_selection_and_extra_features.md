# Tech-Stack Rationale

## Tools Used
- **Frontend**  React 18 + **Vite** bundler, TypeScript, Chakra UI
- **Backend**  Python 3.11, FastAPI, OpenAI Embeddings
- **Vector Store**  Qdrant (self-host or Cloud)
- **Others**  pypdf2 (PDF parsing), uvicorn (ASGI server)

---

## Why Vite for the Front-End
1. **Instant dev startup** – ESBuild-powered server starts in < 500 ms even on large projects.
2. **Lightning-fast HMR** – Hot‑module reload pushes only the changed module; productivity boost during UI tweaks.
3. **Zero‑config TypeScript & JSX** – No extra Webpack/Babel plumbing; out‑of‑the‑box TS support.
4. **Small production bundles** – Uses Rollup under the hood for tree‑shaken, optimized output.
5. **First‑class React ecosystem** – Widely adopted; easy deployment to Vercel/Netlify.

---

## Why Qdrant for the Vector Database
1. **Open‑source & free** – Apache‑2 licence; avoids Pinecone’s paywall and vendor lock.
2. **Lightweight & self‑hostable** – Single binary/Docker image; perfect for local dev and on‑prem MVPs.
3. **Fast ANN + metadata filters** – HNSW index with server‑side payload filtering keeps latency low while supporting complex queries.
4. **Atomic payload updates** – Built‑in `Increment` operator lets us persist `usage_count` without a read‑modify‑write race.
5. **Scale path when needed** – Same API works on Qdrant Cloud with horizontal sharding.

_Qdrant checks every requirement (speed, filters, update‑in‑place) while staying cost‑effective for an MVP._

---

## Extra Features Implemented
- **Interactive UI** – A React page demonstrates all API endpoints.
- **Content‑Generation APIs** – Endpoints for summarizing papers and comparing findings across journals.
- **Persistent Usage Tracking** – Each chunk’s `usage_count` is incremented on every retrieval and stored directly in Qdrant for analytics.
