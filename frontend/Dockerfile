FROM node:18 as develop-stage
WORKDIR /app
RUN npm install -g create-react-app
EXPOSE 3000

FROM node:18 as build-stage
WORKDIR /app
COPY ./app .
RUN npm install
RUN npm run build

FROM nginx:1.17.4-alpine
RUN apk add --no-cache bash
COPY ./nginx/wait.sh /wait.sh
CMD ["/wait.sh", "frontend:3000", "--", "nginx", "-g", "daemon off;"]
RUN rm /etc/nginx/conf.d/default.conf
COPY /nginx/default.conf /etc/nginx/conf.d

