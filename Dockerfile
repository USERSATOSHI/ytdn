FROM oven/bun:latest

COPY package.json ./
COPY bun.lockb ./
RUN mkdir ./src
RUN mkdir ./temp
COPY ./src ./src

RUN bun install
RUN ls
ENV NODE_ENV production

CMD [ "bun", "start" ]
