# Project Structure

```
HisaabKitaab/
├── backend/                    # Node.js + Express + TypeScript backend
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Custom middleware (auth, validation)
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Helper functions
│   │   └── server.ts         # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                  # React + TypeScript frontend
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Helper functions
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tailwind.config.js
│
├── docs/                      # Project documentation
│   ├── IMMEDIATE_LOGOUT_FIXES.md
│   ├── PERSONALIZED_AUTHENTICATION_FIX.md
│   ├── PROJECT_SETUP_GUIDE.md
│   ├── SESSION_PERSISTENCE_IMPROVEMENTS.md
│   └── TRANSACTIONS_PAGE_COMPLETE.md
│
├── .gitignore                # Git ignore rules
├── package.json              # Root package.json for monorepo scripts
├── README.md                 # Main project documentation
└── PROJECT_STRUCTURE.md      # This file

## Files NOT Included in Version Control

The following directories/files are excluded via .gitignore:
- `node_modules/` - Dependencies (regenerated via npm install)
- `dist/` - Compiled backend code (regenerated via npm run build)
- `build/` - Built frontend code (regenerated via npm run build)
- `.env` files - Environment variables (sensitive)
- `.vscode/`, `.idea/` - IDE-specific configs
- Log files and temporary files

## Rationale

### ✅ What We Keep:
- **Source Code**: All .ts, .tsx, .js, .jsx files in src/
- **Configuration**: Package.json, tsconfig.json, tailwind.config.js
- **Documentation**: README.md and docs/ folder
- **Public Assets**: Images, icons, manifest files

### ❌ What We Remove:
- **node_modules/**: Can be reinstalled via `npm install`
- **Build outputs** (dist/, build/): Generated during build process
- **IDE configs**: User-specific preferences
- **Environment files**: Contains sensitive data

## Benefits of This Structure

1. **Clear Separation**: Frontend and backend are clearly separated
2. **Scalable**: Easy to add new modules or services
3. **Maintainable**: Well-organized documentation
4. **Clean Repository**: Only essential files in version control
5. **Standard Practice**: Follows industry best practices

## Quick Commands

```bash
# Install all dependencies
npm run install-deps

# Run development servers (both frontend and backend)
npm run dev

# Build for production
npm run build

# Run backend only
npm run server

# Run frontend only
npm run client
```
