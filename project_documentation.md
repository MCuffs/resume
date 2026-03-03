# Arthurian Studio - Website Documentation & Design Specification
Date: 2026-02-01
Version: 1.2
Status: Active

---

## 1. Project Overview
Arthurian Studio is a premium creator agency website built to connect high-potential creators with brands and provide them with professional growth infrastructure. The website focuses on three key pillars: **Transparency, Growth, and Technology**.

### Key Objectives
*   **Recruitment:** Attract new creators (Streamers/YouTubers) with clear benefits and success stories.
*   **Partnership:** Connect brands with verified creators for sponsorship and campaigns.
*   **Education:** Provide industry insights and tips through a dedicated blog.

---

## 2. Technology Stack

### Core Framework
*   **Frontend:** React 18, TypeScript, Vite
*   **Styling:** Tailwind CSS, Lucide React (Icons), React Icons
*   **Animation:** Framer Motion (Page transitions, scroll effects, complex UI interactions)

### Key Libraries
*   **Routing:** React Router DOM v6
*   **SEO:** React Helmet Async (Dynamic metadata management)
*   **Content:** React Markdown (Blog rendering), Gray Matter (Frontmatter parsing)
*   **Internationalization:** i18next (Korean/English support foundation)
*   **UI Components:** Radix UI primitives (Dialog, Dropdown, etc.), Shadcn UI pattern

---

## 3. Design System

### Visual Identity
*   **Concept:** "Next-Gen Agency"
*   **Aesthetics:** Minimalist, Grid-based layout, High-contrast typography

### Color Palette
*   **Neutral (primary):** `neutral-50` to `neutral-900` (Modern grayscale)
*   **Brand Accents:**
    *   **Red:** `#DC2626` (YouTube identity)
    *   **Black/Pink/Blue:** (TikTok identity)
    *   **Blue:** `#2563EB` (Trust/Professionalism)
*   **Backgrounds:** White (`#FFFFFF`) to Light Gray (`#F9FAFB`) for clean readability. Dark Mode (`#171717`) for specific high-impact sections.

### Typography
*   **Headings:** Sans-serif, Bold weights (700/800), Tight tracking.
*   **Body:** Sans-serif, Readable lines (relaxed line-height), Neutral-600 color for reduced eye strain.

---

## 4. Site Structure (Sitemap)

The website is structured into 4 main sections plus a blog system.

### 4.1. Global Navigation (`NavBar`)
*   **Home:** Landing page
*   **Platform (Dropdown):**
    *   Threads
    *   YouTube
    *   TikTok
*   **Benefit:** Pricing & Fees structure (Newly redesigned)
*   **Blog:** Content hub
*   **Action:** Creator Support Button

### 4.2. Page Breakdown

#### 🏠 Home Page (`/`)
*   **Hero Section:** Dynamic "We are the First" slogan with typewriter effect.
*   **Stats:** Live counter for "Creators", "Total Viewers", "Partner Brands".
*   **Creator Showcase:** Infinite marquee interacting with verified creator profiles.
*   **Values:** Core philosophy (Transparent, Data-driven, Creator-first).
*   **Partners:** Scrolling logos of brand partners.
*   **CTA:** Dual pathway for Creators and Brands.

#### 📱 Platform Pages (Under `/platform/`)
Detailed landing pages for each vertical.

1.  **TikTok (`/platform/tiktok`)**
    *   **Focus:** Live streaming monetization & Short-form viral.
    *   **Features:** Interactive Reaction Board video demo, Sound Board showcase.
    *   **Value:** 1:1 Engineering support for broadcasting.

2.  **YouTube (`/platform/youtube`)**
    *   **Focus:** Branded Content & Sponsorships.
    *   **Actual Cases:** Real-world examples (BBQ, Pulmuone, Beauty Brand) with blurred visuals and success metrics.
    *   **Process:** 4-Step matching and production workflow.

3.  **Threads (`/platform/threads`)**
    *   **Focus:** Text-based engagement & Community building.
    *   **Strategy:** Early-adopter advantage strategies.

#### 💰 Benefit / Pricing Page (`/benefit`)
Redesigned from a generic benefit list to a structured Pricing & Fee transparency page.
*   **Tab System:** Toggle between `For Creator` and `For Brand`.
*   **Creator Tab:**
    *   Platform Fee: 0 KRW (Free to join).
    *   Matching Fee: 10% (Lowest in industry).
    *   **Earnings Table:** Estimated earnings per view/post for Micro vs Macro influencers.
*   **Brand Tab:**
    *   Service Fee: 15% (Standard).
    *   Guarantee Program: ROI assurance.
    *   **Campaign Packages:** Starter / Growth / Viral pack pricing.

#### 📰 Blog System (`/blog` & `/blog/:slug`)
*   **Listing:** Category filtering (Studio Story, Growth Story, Tips).
*   **Search:** Real-time post filtering.
*   **Article View:** Markdown-rendered content with SEO optimization.
*   **Key Content:**
    *   "Why Arthurian?" (Founding Story)
    *   "New Creator Onboarding" (Success Story)
    *   "BBQ Chicken Case Study" (Marketing Insight)

---

## 5. Functional Features

### 🔍 SEO & Meta Data
*   Implemented `SEO` component wrapping every page.
*   Dynamic `title` and `description` based on current route/article.
*   OpenGraph tags for social sharing preview.

### ⚡ Performance & UX
*   **Lazy Loading:** Images optimized for loading speed.
*   **Skeletons:** (Planned/Implicit) Smooth loading states.
*   **Animations:**
    *   `BadgeCheck` motion on lists.
    *   `AnimatePresence` for smooth tab switching.
    *   Scroll-triggered fade-ins for sections.

### 🌐 Scalability
*   **Component Architecture:** Reusable `BlogCard`, `SEO`, `NavBar` components.
*   **Data-Driven:** Blog posts and Creator lists are managed via structured data arrays, allowing easy addition of new content without touching UI code.

---

## 6. Directory Structure

```text
src/
├── assets/             # Static assets (images)
├── components/         # Reusable UI components
├── lib/                # Utilities (Blog logic, helpers)
├── pages/              # Route components
│   ├── cases/          # Case studies specifics
│   └── platforms/      # Vertical landing pages
├── types/              # TypeScript definitions
└── App.tsx             # Main Router configuration
```
