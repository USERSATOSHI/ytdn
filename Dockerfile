FROM oven/bun:latest

COPY package.json ./
COPY bun.lockb ./
COPY src ./

RUN bun install
WORKDIR "/src"
RUN bun run index.ts
