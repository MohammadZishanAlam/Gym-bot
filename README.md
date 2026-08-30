# 🏋️‍♂️ Gymbot AI: Your Personal AI Fitness Trainer

[![Next.js](https://img.shields.io/badge/Next.js-15.1-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **Modern full-stack AI fitness coach built with Next.js 15, Tailwind CSS, and Google Gemini API — generate custom workout splits, nutritional guidance, and exercise form corrections instantly.**

---

## ✨ Features

- 🏋️ **Custom Workout Routine Generator** — Personalized splits (Push/Pull/Legs, Upper/Lower, Full Body, Home Workouts)
- 🥗 **Diet & Macronutrient Coaching** — Tailored calorie and protein estimates for hypertrophy or fat loss
- ⚡ **Real-time AI Chat** — Powered by Google Gemini 2.5 Flash model
- 🎨 **Responsive Dark UI** — Built with Tailwind CSS and Lucide icons
- 🚀 **Serverless Architecture** — Instant deployment to Vercel with zero server maintenance

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Frontend:** React 19, Tailwind CSS, Lucide React
- **AI Engine:** Google Gemini API (`@google/genai`)
- **Deployment:** Vercel

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/MohammadZishanAlam/Gym-bot.git
cd Gym-bot
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment on Vercel

1. Push this repository to GitHub.
2. Import the repo on [Vercel](https://vercel.com).
3. Under **Environment Variables**, add:
   - Key: `GEMINI_API_KEY`
   - Value: `your_gemini_api_key`
4. Click **Deploy**.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 👤 Author

Developed by **[Mohammad Zishan Alam](https://github.com/MohammadZishanAlam)**
