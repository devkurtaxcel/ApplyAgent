# 🛠️ ARCHITECTURE: "Authorized to Act" Deep Dive

**ApplyAgent** implements a sophisticated identity and authorization flow for AI Agents. This document details how we solve the "Trust Gap" using **Auth0 v4** and **Next.js 16**.

---

## 1. The Core Identity Pattern

When a user interacts with an AI agent, they are typically faced with a binary choice: Give the agent full access (API Key) or no access (Observe only).

We break this binary by introducing a **Token of Authority**.

### Flow of Consent:
1.  **Identity Foundation**: User authenticates with Auth0.
2.  **Consent Granting**: During login, the user is presented with specific OAuth 2.0 scopes (e.g., `https://www.googleapis.com/auth/gmail.send`).
3.  **Scoped Authority**: Auth0 issues a session that contains these grants. The agent now has "Authority to Act" but ONLY for the specific action of Gmail sending.

---

## 2. Zero-Trust with Auth0 Token Vault

A critical security risk in AI is "Secret Leakage". If an LLM sees a raw access token, it might inadvertently leak it in logs or refine its own model based on that secret.

### The Solution:
- **ApplyAgent** never exposes raw Google access tokens to the AI orchestrator (Gemini).
- Instead, we use the **Auth0 Token Vault**.
- The `Agent Action Handler` retrieves the scoped token from the vault server-side and executes the API call. 
- **The LLM only hears about the "Intent" and the "Result", never the "Secret".**

---

## 3. Human-in-the-Loop (HITL) Gatekeeper

AI Agents are probabilistic. High-stakes actions (like applying for a job) must be deterministic.

### Implementation:
- **Application Draft**: The agent generates a complete draft (Email, Cover Letter, Strategy).
- **Review Loop**: The user can modify anything in the browser.
- **Explicit Authorization**: The final **Autonomous Application** button check-box is the definitive user consent for that specific execution of authority.

---

## 4. Next.js 16 + Auth0 v4 Proxy Architecture

We use the latest **Auth0 v4 SDK**, which shifts from an API Route approach to a **Middleware Proxy approach**.

### How it works:
- All authentication traffic is intercepted by `src/proxy.ts`.
- This ensures that every request is handled in the **Edge Runtime** where it can be securely proxied to the Auth0 Identity Layer.
- This creates a cleaner, more secure boundary between the "Agentic Logic" and the "Identity Logic".

---

## 🏗️ Technical Stack Details
- **LLM**: Gemini 1.5 Pro (via Google AI SDK).
- **Session Management**: Auth0 SDK v4 (Client & Server components).
- **State Management**: Next.js 19 React Hooks (Suspense & Action states).
- **UI Architecture**: Tailwind CSS 4 + Framer Motion (Spring Physics for celebratory overlays).

---

*This architecture provides a scalable blueprint for building any specialized AI agent that needs to participate in user-owned API ecosystems securely.*
