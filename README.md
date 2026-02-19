# Kosher Star Kitchen

A web app that generates Michelin-star level, strictly Kosher recipes tailored to your appliances and skill level.

## Features

- **Kosher recipes** — supports Fleishig (meat), Milchig (dairy), and Pareve categories with clear kosher guidance
- **Michelin-level quality** — elegant dishes crafted with fine-dining techniques
- **Beginner-friendly instructions** — every step explains the "why", defines culinary terms, and warns about common mistakes
- **Kitchen manager** — track which appliances you own; recipes only use what you have
- **Customizable** — choose meal type, cuisine style, servings, and add special requests

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Add your Anthropic API key to `.env.local`:
   ```
   ANTHROPIC_API_KEY=your_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. **My Kitchen** (`/appliances`) — check off the appliances you own. This is saved in your browser and persists across visits. You can also add custom appliances.

2. **Recipes** (`/`) — choose your meal type, kosher category, cuisine style, and servings. Hit Generate and get a complete recipe in about 15 seconds.

## Tech Stack

- [Next.js 16](https://nextjs.org/) with App Router
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Anthropic Claude](https://www.anthropic.com/) for recipe generation
- TypeScript
- `localStorage` for appliance persistence
