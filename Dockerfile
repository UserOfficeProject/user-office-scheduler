FROM node:16.13-alpine AS build-stage

WORKDIR /app

RUN echo "GENERATE_SOURCEMAP=false" >> .env

COPY package*.json /app/

RUN CYPRESS_INSTALL_BINARY=0 npm ci --loglevel error --no-fund

COPY ./ ./

RUN npm run build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.20-alpine
COPY --from=build-stage --chown=nginx:nginx /app/build /usr/share/nginx/html/scheduler

ARG BUILD_VERSION=<unknown>
RUN echo $BUILD_VERSION > /usr/share/nginx/html/scheduler/build-version.txt

RUN mkdir -p /etc/nginx/templates
COPY ./default.conf.template /etc/nginx/templates
