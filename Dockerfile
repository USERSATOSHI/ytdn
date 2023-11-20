FROM oven/bun:latest

COPY package.json ./
COPY bun.lockb ./
COPY ./src ./

RUN bun install
RUN ls
ENV NODE_ENV production

CMD [ "bun", "start" ]
