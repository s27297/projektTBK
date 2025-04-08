

# Definiujemy argument z wartością domyślną
ARG NODE_VERSION=alpine

ARG CONTAINER_USER=default
# Używamy argumentu w instrukcji FROM
FROM node:${NODE_VERSION} AS BUILD_IMAGE

RUN apk update && apk add shadow && apk add --no-cache bash
#    apk cache clean

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install && npm cache clean --force && npm prune --production
COPY ./api .


RUN adduser --system --no-create-home newuser
USER newuser
EXPOSE ${PORT}

ARG ENV=production
ENV NODE_ENV=${ENV}

LABEL author="Artem Stakhovski s27297@pjwstk.eu.pl"
LABEL version="1.0.3"
LABEL date_creation="04.04.2025"
LABEL opis="to jest backend applikacji"

#
#FROM node:12-alpine
#
#WORKDIR /app
#
## copy from build image
#COPY --from=BUILD_IMAGE /app/api .
#COPY --from=BUILD_IMAGE /app/node_modules ./node_modules

HEALTHCHECK CMD curl --fail http://localhost:5000/health || exit 1
CMD ["node","./project.js" ]

EXPOSE 5000