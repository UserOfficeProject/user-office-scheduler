FROM node:16.13-alpine AS build-stage

# NOTE: This is needed for multi-platform builds
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

WORKDIR /app

RUN echo "GENERATE_SOURCEMAP=false" >> .env

COPY package*.json /app/

RUN npm ci --loglevel error --no-fund

COPY ./ ./

RUN npm run build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.22.0-alpine
COPY --from=build-stage --chown=nginx:nginx /app/build /usr/share/nginx/html/scheduler

ARG BUILD_VERSION=<unknown>
RUN echo $BUILD_VERSION > /usr/share/nginx/html/scheduler/build-version.txt

RUN mkdir -p /etc/nginx/templates
COPY ./default.conf.template /etc/nginx/templates
