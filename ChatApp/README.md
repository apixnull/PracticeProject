# 🟢 ChatApp – Real-time Chat Application


## 🌐 Overview

**ChatApp** is a sleek, real-time chat application built using **React 19**, **Supabase**, and **Tailwind CSS**. It offers seamless messaging, user presence tracking, animations powered by **Framer Motion**, and Google-based authentication.

---

## ✨ Features

- 🔒 Google Authentication via Supabase  
- 💬 Real-time messaging using Supabase channels  
- 👥 Online user presence tracking  
- ✨ Smooth animations with Framer Motion  
- 📱 Responsive design  
- 🔄 Message history persistence  
- ⚡ Fast development with Vite  
- 🎨 Beautiful UI with Tailwind CSS  

---

## 🛠️ Tech Stack

| Category         | Technology                     |
|------------------|--------------------------------|
| **Frontend**     | React 19                       |
| **Styling**      | Tailwind CSS                   |
| **Animations**   | Framer Motion                  |
| **Icons**        | Lucide React                   |
| **Realtime DB**  | Supabase                       |
| **Build Tool**   | Vite                           |
| **Linting**      | ESLint                         |

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js (v18+ recommended)  
- npm (v9+ recommended)  
- Supabase account  

### 🔧 Installation

```bash
git clone https://github.com/yourusername/chatapp.git
cd chatapp
npm install
```

### 🔐 Setup `.env`

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### ▶️ Run the app

```bash
npm run dev
```

---

## 🧪 Available Scripts

| Script            | Description                  |
|-------------------|------------------------------|
| `npm run dev`     | Start development server     |
| `npm run build`   | Create production build      |
| `npm run lint`    | Run ESLint checks            |
| `npm run preview` | Preview production build     |

---

## 🧩 Supabase Setup

1. [Create a new Supabase project](https://supabase.io)  
2. Enable **Google Authentication** under *Authentication → Providers*  
3. Create a `channels` table  
4. Add the following RLS policy to `channels`:

```sql
CREATE POLICY "Enable realtime" ON "public"."channels"
AS PERMISSIVE FOR SELECT
TO public
USING (true);
```

---

## 🧭 Environment Variables

| Variable                 | Description                        |
|--------------------------|------------------------------------|
| `VITE_SUPABASE_URL`      | Your Supabase project URL          |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous API key    |

**Example:**

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 📦 Dependencies

```json
"dependencies": {
  "@supabase/supabase-js": "^2.49.8",
  "@tailwindcss/vite": "^4.1.8",
  "framer-motion": "^12.15.0",
  "lucide-react": "^0.511.0",
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "tailwindcss": "^4.1.8"
},
"devDependencies": {
  "@eslint/js": "^9.25.0",
  "@types/react": "^19.1.2",
  "@types/react-dom": "^19.1.2",
  "@vitejs/plugin-react-swc": "^3.9.0",
  "eslint": "^9.25.0",
  "eslint-plugin-react-hooks": "^5.2.0",
  "eslint-plugin-react-refresh": "^0.4.19",
  "globals": "^16.0.0",
  "vite": "^6.3.5"
}
```

---

## 📬 Feedback & Contributions

Pull requests and feedback are welcome!  
For major changes, please open an issue first to discuss what you would like to change.

---

## 📝 License

MIT License © 2025 – [yourusername](https://github.com/yourusername)
