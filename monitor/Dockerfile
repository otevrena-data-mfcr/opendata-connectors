FROM node:alpine

# BUILD
WORKDIR /srv

COPY . .

RUN cd common && npm ci && npm run build

RUN cd monitor && npm ci && npm run build

# RUN
WORKDIR /srv/monitor

EXPOSE 3000

CMD ["npm", "start"]