# backend/.env.example
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/bookit
NODE_ENV=development

# frontend/.env.example
VITE_API_URL=http://localhost:5000/api

# .gitignore (root level)
# Dependencies
node_modules/
.pnpm-debug.log*
.npm

# Environment variables
.env
.env.local
.env.production
.env.development

# Build outputs
dist/
build/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Testing
coverage/

# Misc
*.tsbuildinfo

# backend/.env (for local development)
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bookit
NODE_ENV=development

# frontend/.env (for local development)
VITE_API_URL=http://localhost:5000/api

# Deployment files

# Render - render.yaml (for backend)
services:
  - type: web
    name: bookit-backend
    env: node
    buildCommand: cd backend && npm install && npm run build
    startCommand: cd backend && npm start
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: bookit-db
          property: connectionString
      - key: NODE_ENV
        value: production

databases:
  - name: bookit-db
    databaseName: bookit
    user: bookit

# Vercel - vercel.json (for frontend)
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend-url.com/api/:path*"
    }
  ]
}

# Docker setup (optional)

# Dockerfile.backend
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]

# Dockerfile.frontend
FROM node:18-alpine as build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: bookit
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/bookit
      NODE_ENV: development
    depends_on:
      - postgres

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  postgres_data: