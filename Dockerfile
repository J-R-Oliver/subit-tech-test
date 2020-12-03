FROM node:current-alpine AS build-stage
WORKDIR /usr/src/app
COPY . .
RUN npm ci
RUN npm run build

FROM node:current-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build-stage /usr/src/app/build ./build
EXPOSE 9090
CMD ["npm", "start"]