FROM node:gallium-alpine
ADD . /app
WORKDIR /app
RUN yarn install && yarn build

FROM nginx:1.25.2-alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY --from=0 /app/deploy/write-config.sh /docker-entrypoint.d/
COPY --from=0 /app/deploy/default.conf /etc/nginx/conf.d/default.conf