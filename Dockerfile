FROM node:14-alpine as build-stage
WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
ENV VUE_APP_BASE_API 'https://api.hsclso.vn/customer-backend'
ENV VUE_APP_AUTH_API 'https://api.hsclso.vn/customer-authorization'
ENV VUE_APP_UPLOAD_API 'https://api.hsclso.vn/customer-upload'

RUN yarn
COPY . .
RUN yarn build:prod
# production stage
FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
