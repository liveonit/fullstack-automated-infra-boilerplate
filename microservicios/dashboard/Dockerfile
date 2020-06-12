FROM node:13-alpine as build-deps

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json

RUN yarn

COPY . ./
RUN yarn build

# Stage 2 - the production environment
FROM nginx:1.15.1
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]