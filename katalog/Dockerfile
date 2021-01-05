FROM node:alpine

# BUILD
WORKDIR /srv

COPY . .

RUN cd common && npm ci && npm run build

RUN cd ckan && npm ci && npm run build

# RUN
WORKDIR /srv/ckan

EXPOSE 3000

CMD ["npm", "start"]