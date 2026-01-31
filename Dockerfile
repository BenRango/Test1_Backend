FROM node:lts-alpine AS builder

RUN apk add --no-cache python3 make g++ sqlite-dev

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:lts-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

EXPOSE 3800
CMD ["node", "dist/index.js"]
