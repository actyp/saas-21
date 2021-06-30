FROM node:14.16.0 as build

WORKDIR /app

COPY ./package*.json ./

RUN npm install
COPY . .
RUN npm run build

FROM ubuntu:16.04

RUN apt update -y \
    && apt install nginx -y \
    && rm -f /etc/nginx/sites-enabled/default \
    && apt-get install software-properties-common -y \
    && add-apt-repository ppa:certbot/certbot -y \
    && apt-get update -y \
    && apt-get install python-certbot-nginx -y \
    && apt-get clean

COPY --from=build /app/build /usr/share/nginx/html/

CMD ["nginx", "-g", "daemon off;"]