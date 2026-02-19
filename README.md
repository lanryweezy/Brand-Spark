

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/167tyIp1Q87_WGyEqiyYocdgodKejYa4T

## Run Locally

**Prerequisites:** Node.js

### 🚀 Run in Demo Mode (Recommended First)

The demo mode uses mock data and does not require a backend or API keys.

1.  **Install dependencies:**
    `npm install`
2.  **Create a `.env.local` file** at the project root with the following content:
    ```
    VITE_DEMO_MODE=true
    VITE_USE_MOCKS=true
    ```
3.  **Run the app:**
    `npm run dev`

The app will open in your browser with the Demo page active.

### ⚡️ Run with Live AI Features

This mode connects to the AI backend and requires a Gemini API key.

1.  **Install dependencies:**
    `npm install`
2.  **Create a `.env.local` file** and set your Gemini API key:
    ```
    VITE_GEMINI_API_KEY=your-gemini-api-key-here
    ```
3.  **Run the app:**
    `npm run dev`
