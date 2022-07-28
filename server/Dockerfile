FROM node:gallium-alpine
ADD . /app
WORKDIR /app
RUN yarn install && yarn build
CMD ["yarn", "start"]