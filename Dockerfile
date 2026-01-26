FROM node:lts-alpine AS builder

RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    sqlite-dev

WORKDIR /app

COPY package*.json ./

RUN npm install
#RUN npm install sqlite3 --save-dev
COPY . .

RUN npm run test
RUN npm run build

FROM node:lts-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.env* ./.env.local


RUN mkdir -p /app/dist/downloads/productImages /app/dist/downloads/multimedia /app/dist/downloads/articleIllustrations 


EXPOSE 3800

CMD ["npm","run" , "start"]
