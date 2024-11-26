FROM oven/bun:latest as shared-builder

WORKDIR /app/shared

COPY apps/shared/package.json .

COPY apps/shared/tsconfig.json .

COPY apps/shared/src ./src

RUN bun install

RUN bun run build
