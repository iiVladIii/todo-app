FROM node:18 AS build

WORKDIR /app

COPY . .

RUN rm -rf node_modules
RUN rm -rf dist

RUN npm install

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx.conf.template /etc/nginx/templates/nginx.conf.template

CMD ["/bin/sh", "-c", "envsubst '${BACKEND_PORT}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]

EXPOSE 80
