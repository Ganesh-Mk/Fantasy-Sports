# 🏏 Fantasy Cricket Team Builder

<div align="center">

**Build your dream cricket team with AI-powered suggestions and real-time validation**

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC.svg)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Components-000000.svg)](https://ui.shadcn.com/)

</div>

---

## ✨ Features

### 🎯 **Smart Team Building**

- **AI-Powered Suggestions**: Get 3 strategic team recommendations (Balanced, Aggressive, Value Picks)
- **Quick Fill**: Auto-complete your team with optimal players
- **Real-time Validation**: Instant feedback on rule compliance
- **Visual Team Slots**: See your 11-player team with live validation

### 🎮 **Interactive Experience**

- **Advanced Filtering**: Search and filter players by role, team, country, credits
- **Captain/Vice-Captain**: Strategic leadership selection (2x/1.5x points)
- **Team Management**: Create, edit, and save multiple teams
- **Contest Display**: View available contests and entry fees

### 📱 **Modern UI/UX**

- **Responsive Design**: Optimized for mobile and desktop
- **Smooth Animations**: Modern interface with Tailwind CSS
- **Intuitive Navigation**: Clean, easy-to-use interface

---

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── captains/         # Captain selection components
│   ├── contests/         # Contest display components
│   ├── matches/          # Match-related components
│   ├── players/          # Player selection components
│   └── teams/            # Team management components
├── pages/                # Main application pages
├── services/             # API services and hooks
├── utils/                # Business logic and algorithms
└── types/                # TypeScript type definitions
```

---

## 🎯 Team Selection Rules

### 📋 **Core Constraints**

- **11 Players** exactly
- **100 Credits** maximum budget
- **7 Players** max from one team

### 🏃 **Role Requirements**

| Role                 | Min | Max | Description               |
| -------------------- | --- | --- | ------------------------- |
| 🏏 **Batsman**       | 3   | 7   | Power hitters and anchors |
| 🥊 **Bowler**        | 3   | 7   | Pace and spin specialists |
| 🏃 **All-Rounder**   | 0   | 4   | Versatile players         |
| 🧤 **Wicket-Keeper** | 1   | 5   | Stumping and batting WK   |

### 👑 **Captain System**

- **Captain**: 2x fantasy points
- **Vice-Captain**: 1.5x fantasy points
- Strategic selection based on match conditions

---

## 🤖 AI-Powered Features

### **Smart Team Suggestions**

Get intelligent team recommendations based on different strategies:

- **Balanced**: Mix of star players and budget options for consistent performance
- **Aggressive**: Focus on premium players for maximum points potential
- **Value Picks**: Underrated budget players with high upside

### **Quick Fill**

Automatically complete your team with optimal players that fit within remaining budget and role constraints.

### **Smart Validation**

Real-time checking ensures all teams comply with fantasy cricket rules before allowing progression.

````

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Ganesh-Mk/Fantasy-Sports.git
   cd Fantasy-Sports
````

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
npm run preview
```

### Using Bun (Recommended)

Since this project uses Bun, you can also use:

```bash
bun install
bun run dev
bun run build
```

---

## 🐳 Docker & Docker Compose

### Prerequisites

- **Docker** and **Docker Compose** installed on your system

### Using Docker Compose (Recommended)

The project includes a `docker-compose.yml` file for easy setup and deployment.

#### Quick Start

```bash
# Start the application in detached mode
npm run docker:start
# or
docker-compose up -d

# View logs
npm run docker:logs
# or
docker-compose logs -f
```

#### Available Docker Commands

| Command                  | Description                                  |
| ------------------------ | -------------------------------------------- |
| `npm run docker:start`   | Start containers in background and show logs |
| `npm run docker:up`      | Start containers (foreground)                |
| `npm run docker:stop`    | Stop all containers                          |
| `npm run docker:restart` | Restart containers                           |
| `npm run docker:logs`    | Follow container logs                        |
| `npm run docker:rebuild` | Rebuild and restart containers               |
| `npm run docker:status`  | Show container status                        |

#### Manual Docker Compose Commands

```bash
# Start services
docker-compose up -d

# View running containers
docker-compose ps

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# View logs
docker-compose logs -f
```

### Direct Docker Commands

If you prefer to use Docker directly:

```bash
# Build the image
docker build -t fantasy-sports .

# Run the container
docker run -p 3000:80 fantasy-sports
```

Access the app at `http://localhost:3000`

---

## 🚀 CI/CD

This project uses GitHub Actions for continuous integration and deployment to Vercel.

### Workflow

- **Lint**: Runs ESLint on code
- **Build**: Builds the project
- **Deploy**: Deploys to Vercel on push to main branch

### Required Secrets

Set the following secrets in your GitHub repository settings:

- `VERCEL_TOKEN`: Your Vercel token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

---

## 🎮 Live site

```
 fantasy-sports-live.vercel.app
```

## 🎮 User Journey

### 1. **Match Selection**

- Browse upcoming cricket matches
- View match details and teams
- Select your preferred match

### 2. **Team Building**

```
🏏 Select Match → 🎯 Pick Players → 👑 Choose Captain → ✅ Save Team
```

#### **Player Selection Flow**

- **Browse Players**: Filter by role, team, country
- **Add/Remove**: Click players to select/deselect
- **Real-time Validation**: See rule compliance instantly
- **AI Assistance**: Get smart suggestions or quick fill

#### **Captain Selection**

- **Strategic Choice**: Pick captain and vice-captain
- **Point Multipliers**: 2x and 1.5x fantasy points
- **Match Analysis**: Consider pitch and conditions

### 3. **Contest Participation**

- Join multiple contests with one team
- Track performance across contests
- Compare with other users

---

## 🔧 Technical Features

## 🔧 Technical Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite for fast development
- **State Management**: React hooks with local storage
- **Routing**: React Router for navigation
- **Icons**: Lucide React icon library

---

## 🎨 UI/UX Design

### **Design System**

- **shadcn/ui**: High-quality component library
- **Tailwind CSS**: Utility-first styling
- **Lucide Icons**: Consistent iconography
- **Urbanist Font**: Modern typography

### **Animation & Interactions**

- **Smooth Transitions**: 300ms ease-out
- **Hover Effects**: Subtle scaling and shadows
- **Loading States**: Skeleton screens
- **Toast Notifications**: User feedback

<div align="center">

**Made with ❤️ for cricket fans worldwide**

[⭐ Star us on GitHub](https://github.com/your-username/fantasy-cricket-team-builder) • [🐛 Report Issues](https://github.com/your-username/fantasy-cricket-team-builder/issues) • [💬 Join Discussions](https://github.com/your-username/fantasy-cricket-team-builder/discussions)

</div>
