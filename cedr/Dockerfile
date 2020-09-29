FROM node:alpine

# BUILD
WORKDIR /srv

COPY . .

RUN cd common && npm ci && npm run build

RUN cd cedr && npm ci && npm run build

# RUN
WORKDIR /srv/cedr

EXPOSE 3000

CMD ["npm", "start"]