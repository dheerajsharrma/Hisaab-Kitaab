# 🚀 Expense Tracker Project - VS Code Setup Guide

This is a full-stack expense tracker application built with Node.js/Express (backend) and React/TypeScript (frontend).

## 📋 Prerequisites

Before starting, make sure you have these installed:

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **VS Code** - [Download here](https://code.visualstudio.com/)
3. **Git** (optional) - [Download here](https://git-scm.com/)

## 🔧 VS Code Extensions (Recommended)

Install these extensions in VS Code for better development experience:

1. **ES7+ React/Redux/React-Native snippets** - For React snippets
2. **TypeScript Importer** - Auto imports for TypeScript
3. **Prettier - Code formatter** - Code formatting
4. **ESLint** - JavaScript/TypeScript linting
5. **Thunder Client** or **REST Client** - For API testing
6. **Auto Rename Tag** - HTML/JSX tag renaming
7. **Bracket Pair Colorizer** - Better bracket visualization

## 📁 Project Structure

```
expense-tracker/
├── backend/                 # Node.js/Express API server
│   ├── src/
│   ├── package.json
│   └── .env
├── frontend/               # React/TypeScript app
│   ├── src/
│   ├── public/
│   └── package.json
└── PROJECT_SETUP_GUIDE.md  # This file
```

## 🚀 Setup Instructions

### Step 1: Open Project in VS Code

1. **Open VS Code**
2. Click **File > Open Folder**
3. Navigate to and select the `expense-tracker` folder
4. Click **Select Folder**

### Step 2: Open Integrated Terminal

1. Press **Ctrl + `** (backtick) to open the integrated terminal
2. Or go to **View > Terminal**

### Step 3: Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Check if .env file exists and has correct configuration
```

**Important:** Make sure your `backend/.env` file contains:
```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
MONGODB_URI=your_mongodb_connection_string_here
```

### Step 4: Set Up Frontend

Open a **NEW terminal tab/window** (Ctrl + Shift + `) and run:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

## 🏃‍♂️ Running the Application

### Method 1: Using VS Code Terminal (Recommended)

You'll need **2 terminal windows** open in VS Code:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend  
npm start
```

### Method 2: Using VS Code Tasks (Advanced)

Create a `.vscode/tasks.json` file in the root directory:

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Start Backend",
            "type": "shell",
            "command": "npm run dev",
            "options": {
                "cwd": "${workspaceFolder}/backend"
            },
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "new"
            }
        },
        {
            "label": "Start Frontend", 
            "type": "shell",
            "command": "npm start",
            "options": {
                "cwd": "${workspaceFolder}/frontend"
            },
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always", 
                "focus": false,
                "panel": "new"
            }
        },
        {
            "label": "Start Both",
            "dependsOrder": "parallel",
            "dependsOn": [
                "Start Backend",
                "Start Frontend"
            ]
        }
    ]
}
```

Then press **Ctrl + Shift + P**, type "Tasks: Run Task", and select "Start Both".

## 🌐 Access the Application

Once both servers are running:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

## 🔧 VS Code Configuration Files

### 1. Create `.vscode/launch.json` for debugging:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Debug Backend",
            "type": "node",
            "request": "launch",
            "program": "${workspaceFolder}/backend/src/server.ts",
            "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"],
            "runtimeArgs": ["-r", "ts-node/register"],
            "env": {
                "NODE_ENV": "development"
            },
            "cwd": "${workspaceFolder}/backend"
        }
    ]
}
```

### 2. Create `.vscode/settings.json` for workspace settings:

```json
{
    "typescript.preferences.importModuleSpecifier": "relative",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "files.exclude": {
        "**/node_modules": true,
        "**/build": true,
        "**/dist": true
    }
}
```

## 🐛 Troubleshooting

### Backend Issues

**Problem:** Backend won't start
```bash
# Check Node.js version
node --version  # Should be v16+

# Clear node_modules and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install
```

**Problem:** MongoDB connection error
- The app runs in demo mode without database
- To use a real database, set up MongoDB Atlas or local MongoDB
- Update `MONGODB_URI` in `.env` file

### Frontend Issues

**Problem:** Frontend won't start
```bash
# Clear node_modules and reinstall  
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Problem:** Build errors
```bash
# Check for TypeScript errors
npm run build
```

### Port Issues

**Problem:** Port already in use
```bash
# Kill processes on ports
npx kill-port 3000  # Frontend
npx kill-port 5000  # Backend
```

## 📱 Features

- **Authentication:** Login/Register (Demo mode)
- **Dashboard:** Financial overview with charts
- **Transactions:** Add, edit, delete expenses/income
- **Categories:** Expense categorization
- **Dark Mode:** Theme switching
- **Responsive:** Mobile-friendly design

## 🛠 Development Workflow

1. **Start both servers** (backend + frontend)
2. **Make changes** to code files
3. **Auto-reload** happens automatically
4. **Test in browser** at http://localhost:3000
5. **Debug** using VS Code debugger if needed

## 📚 Project Technologies

**Backend:**
- Node.js + Express
- TypeScript
- MongoDB (optional - runs in demo mode)
- JWT Authentication
- Express Validator

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- React Router
- Axios (API calls)
- Recharts (data visualization)

## 🎯 Quick Start Commands

```bash
# Clone and setup (if using git)
git clone <repository-url>
cd expense-tracker

# Install all dependencies
cd backend && npm install
cd ../frontend && npm install

# Start development servers
# Terminal 1:
cd backend && npm run dev

# Terminal 2: 
cd frontend && npm start

# Open browser to http://localhost:3000
```

## 💡 Pro Tips

1. **Use VS Code's split terminal** (click the split icon) to see both backend and frontend logs
2. **Install the recommended extensions** for better development experience
3. **Use Prettier** for consistent code formatting
4. **Enable auto-save** in VS Code for faster development
5. **Use the integrated debugger** instead of console.log for debugging

---

🎉 **You're all set!** Your expense tracker should now be running in VS Code. Happy coding!