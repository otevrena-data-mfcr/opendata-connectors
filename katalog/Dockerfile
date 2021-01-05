FROM node:alpine

# BUILD
WORKDIR /srv

COPY . .

RUN cd common && npm ci && npm run build

RUN cd katalog && npm ci && npm run build

# RUN
WORKDIR /srv/katalog

EXPOSE 3000

CMD ["npm", "start"]