<p align="center">
  <h1 align="center">🛡️ ApplyAgent</h1>
  <p align="center"><strong>Authorized to Act</strong> — A Secure, AI-Powered Job Application Agent</p>
  <p align="center">
    <a href="https://auth0applyagent.vercel.app">Live Demo</a> ·
    <a href="#demo-video">Demo Video</a> ·
    <a href="#architecture">Architecture</a>
  </p>
</p>

---

## What is ApplyAgent?

**ApplyAgent** is an AI agent that analyzes job descriptions and applies on your behalf — sending personalized emails via Gmail and updating your LinkedIn profile — all **without ever accessing your passwords**.

It demonstrates how AI agents can be granted **real power** over user accounts through [Auth0 Token Vault](https://auth0.com/docs/customize/auth0-ai/auth0-ai-overview), while keeping the user **in full control** via scoped permissions, transparent consent, and step-up authentication for high-stakes actions.

### Key Features

| Feature | Description |
|---------|-------------|
| 🧠 **Smart Insight Engine** | Google Gemini 2.5 Flash analyzes job descriptions in real-time, streaming structured Markdown reports with requirements, culture fit, salary insights, and action plans |
| 🔐 **Auth0 Token Vault** | OAuth tokens for Gmail and LinkedIn are retrieved via Token Vault — the agent never sees the user's actual credentials |
| ⚡ **Step-up Authentication** | High-stakes actions (sending emails, updating profiles) require MFA re-verification before execution |
| 🛡️ **Consent Center** | Users see exactly what permissions the agent holds and can review active scopes at any time |
| 📊 **Live Agent Activity Log** | Real-time transparency into every step the agent takes, from analysis to dispatch |
| 🎨 **Premium UI** | Glassmorphism design, Framer Motion animations, streaming Markdown rendering, and responsive dark theme |

---

## Demo Video

> 🎬 **[Watch the Demo on YouTube](YOUR_VIDEO_URL_HERE)**
>
> The video demonstrates the full flow: AI analysis → Step-up verification → Secure dispatch via Token Vault.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LAYER                              │
│  Auth0 Login → Secure Session → Consent Center (Scopes Viewer) │
├─────────────────────────────────────────────────────────────────┤
│                       FRONTEND LAYER                            │
│  Dashboard → Smart Insight Engine → Step-up Modal → Toast       │
│  (Next.js 16 + Framer Motion + ReactMarkdown)                  │
├─────────────────────────────────────────────────────────────────┤
│                       BACKEND LAYER                             │
│  proxy.ts → /api/analyze (Gemini) → /api/apply (Token Vault)   │
│  agent-tools.ts (Gmail + LinkedIn dispatch)                     │
├─────────────────────────────────────────────────────────────────┤
│                     EXTERNAL SERVICES                           │
│  Auth0 Platform (Token Vault) · Google Gemini · Gmail · LinkedIn│
└─────────────────────────────────────────────────────────────────┘
```

### Security Flow

1. **User authenticates** via Auth0 Universal Login
2. **Agent analyzes** a job description using Google Gemini (read-only, no credentials needed)
3. **User clicks "Apply"** → Agent detects this as a **high-stakes action**
4. **Step-up authentication** is required (MFA / biometric verification)
5. **Token Vault retrieves** scoped OAuth tokens for Gmail and LinkedIn
6. **Agent dispatches** the application using those tokens — **never touching the user's password**
7. **User sees** every step in the Live Agent Activity Log with transparent status updates

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Identity | Auth0 v4 SDK (`@auth0/nextjs-auth0`) | Authentication, session management |
| Token Security | Auth0 Token Vault (`@auth0/ai`) | Scoped OAuth token retrieval for Gmail/LinkedIn |
| AI Engine | Google Gemini 2.5 Flash Lite | Job description analysis & strategic insights |
| Frontend | Next.js 16.2 + React 19 | App Router, Server Components |
| Animations | Framer Motion | Smooth UI transitions and micro-interactions |
| Styling | Tailwind CSS 4 | Glassmorphism dark theme |
| Streaming | ReadableStream API | Real-time AI response rendering |
| Markdown | react-markdown + remark-gfm | Professional analysis report formatting |

---

## Getting Started

### Prerequisites

- Node.js 18+
- An [Auth0](https://auth0.com) account with Token Vault enabled
- A [Google AI Studio](https://aistudio.google.com) API key

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/devkurtaxcel/ApplyAgent.git
cd ApplyAgent
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Auth0 and Gemini credentials. See `.env.example` for the required variables.

4. **Run the development server**

```bash
npm run dev
```

5. **Open** [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── proxy.ts                    # Auth0 middleware — route protection & session
├── app/
│   ├── layout.tsx              # Root layout with metadata & fonts
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Design system tokens & glass utilities
│   ├── dashboard/
│   │   └── page.tsx            # Main dashboard — analysis, consent, apply
│   └── api/
│       ├── analyze/route.ts    # POST — Gemini streaming analysis
│       ├── apply/route.ts      # POST — Token Vault dispatch (Gmail + LinkedIn)
│       └── auth/[auth0]/       # Auth0 callback handler
└── lib/
    ├── auth0.ts                # Auth0 client configuration
    └── agent-tools.ts          # Gmail & LinkedIn tool implementations
```

---

## How Token Vault is Used

ApplyAgent uses Auth0 Token Vault as the **core credential security layer**:

- **Gmail**: The agent retrieves a scoped `gmail.send` token from Token Vault to send job application emails on behalf of the user. The token is ephemeral and never stored client-side.
- **LinkedIn**: A `w_member_social` scoped token is retrieved to update the user's LinkedIn status after a successful application.
- **Step-up Protection**: Before any token retrieval, the agent requires the user to complete a step-up authentication challenge (MFA), ensuring that high-stakes actions cannot be triggered without explicit re-verification.

The user's actual OAuth refresh tokens are managed entirely by Auth0 — the agent only receives short-lived access tokens with the minimum required scopes.

---

## Live Demo

🌐 **[auth0applyagent.vercel.app](https://auth0applyagent.vercel.app)**

---

## Author

**Kurt Axcel Peñano**

Built for the [Auth0 "Authorized to Act" Hackathon](https://auth0.devpost.com/) — demonstrating secure, user-controlled AI agent authorization.

---

## License

MIT
