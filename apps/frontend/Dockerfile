# Frontend Dockerfile
FROM oven/bun:latest

# Installation des dépendances de base
WORKDIR /app

# Copie des fichiers de configuration racine
COPY package.json bun.lockb ./

# Copie des package.json
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/shared/package.json ./apps/shared/

# Copie de tous les fichiers sources
COPY apps/shared ./apps/shared
COPY apps/frontend ./apps/frontend

# Build shared
WORKDIR /app/apps/shared
RUN bun install
RUN bun run build

# Setup frontend
WORKDIR /app/apps/frontend
RUN bun install

# Variables d'environnement
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000
ENV NUXT_PUBLIC_API_URL=http://backend:8000

# Expose le port
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]