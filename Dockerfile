FROM oven/bun:latest

COPY package.json ./
COPY bun.lockb ./
COPY ./src

RUN bun install
ENV NODE_ENV production

CMD [ "bun", "start" ]
