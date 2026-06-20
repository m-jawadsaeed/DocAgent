FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma

RUN npm config set fetch-retries 5

RUN npm config set fetch-retry-factor 2

RUN npm config set fetch-retry-mintimeout 20000

RUN npm config set fetch-retry-maxtimeout 120000

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["sh", "-c", "${START_COMMAND}"]