FROM oven/bun:latest

WORKDIR /app
COPY package.json bun.lockb ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/shared/package.json ./apps/shared/
COPY apps/shared ./apps/shared

RUN bun install
COPY apps/backend ./apps/backend

WORKDIR /app/apps/backend
EXPOSE 8000
CMD ["bun", "run", "src/index.ts"]
