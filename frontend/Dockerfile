FROM node:20-alpine AS build

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com

COPY frontend/package*.json ./
RUN npm ci --fetch-timeout=120000 --fetch-retries=5

COPY frontend ./
RUN npm run build

FROM nginx:1.27-alpine

COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
