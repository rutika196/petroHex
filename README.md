# PetroHex Chat App

A modern, sleek chatbot web application with a stylish Apple-inspired UI.

## Features

- Mobile-first responsive design
- Dark mode interface with glossy elements
- Real-time typing indicators
- AI-powered chat mode (OpenAI integration)
- Basic keyword response mode (offline fallback)
- Timestamp displays for all messages

## Prerequisites

- Node.js 14+ and npm

## Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Deploying to Vercel

### Method 1: Vercel CLI (requires access rights)

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```
2. Login to Vercel:
   ```
   vercel login
   ```
3. Deploy the project:
   ```
   vercel
   ```

### Method 2: Vercel Web Interface (Recommended)

1. Push your repository to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Framework Preset: Vite
6. Add environment variables:
   - Name: `VITE_OPENAI_API_KEY`
   - Value: Your OpenAI API key
7. Click "Deploy"

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_OPENAI_API_KEY` | Your OpenAI API key for AI chat responses |

## Technologies

- React 19 with TypeScript
- Vite 6
- Custom CSS (no UI frameworks)
- OpenAI API
