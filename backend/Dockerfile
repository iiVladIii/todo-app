FROM node:18 AS build

ARG MODE
ENV MODE=${MODE}

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x ./build.sh && ./build.sh
RUN ./build.sh

FROM node:18-alpine AS runtime

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

RUN npm ci --only=production

CMD ["node", "dist/server.js"]
