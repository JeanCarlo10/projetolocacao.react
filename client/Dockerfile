FROM node:14-alpine as client

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./
RUN npm ci --silent
COPY . ./

RUN npm run build

FROM nginx:stable-alpine

COPY --from=client /app/build /var/www/html
COPY ./docker/nginx.conf /etc/nginx/conf.d

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]